/**
 * Created by Dev-Bart on 14/07/2016.
 */

try {
    Notification.requestPermission().then(function (result) {

    });

    function notifyMe(msg) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(msg);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(msg);
                }
            });
        }

        // Finally, if the user has denied notifications and you
        // want to be respectful there is no need to bother them any more.
    }

} catch (e) {
    console.log(e);
    alert('OI, notify does not work. DO SOMETHING ABOUT IT FOR GOD`s SAKE');
}

mainloop();

function mainloop() {

    $.get('http://10.0.1.222:8080/login', function (content) {
        var re = /(>log in<)/gi;
        var bredCrumRe = /crumb\.init\("Jenkins-Crumb", "([A-Za-z0-9]*)"\)/gi;

        var resultLogin = content.search(re);
        if (resultLogin > -1) { // we need to log in
            console.log('need to login');
            var breadCrumb = bredCrumRe.exec(content);
            if (breadCrumb) {
                //auth
                var breadCrumbExtracted = breadCrumb[1];

                var user = null;
                var pass = null;

                chrome.storage.sync.get({
                    Overlord_User_Jenkins: '',
                    Overlord_Pass_Jenkins: ''
                }, function (items) {
                    user = items.Overlord_User_Jenkins;
                    pass = items.Overlord_Pass_Jenkins;

                    $.post('http://10.0.1.222:8080/j_acegi_security_check', {
                        j_username: user, //@TODO::config
                        j_password: pass,
                        'Jenkins-Crumb': breadCrumbExtracted
                    }, function (resultDashboard) {
                        var succesCheck = resultDashboard.search(re);

                        if (succesCheck === -1) {
                            rullingThemAllLikeAnFreakingOverlord();
                        } else {
                            notifyMe('Splashhhh ... we did not validated with Jenkins :(');
                        }
                    }).fail(function () {
                        //retry
                        console.log('Login retry')
                        mainloop();
                    });
                });
            } else {
                // HOLY SPAGHETTI AND MEATBALLS NO BREAD CRUMBS
                notifyMe('Oh. No. Thats unexpected');
            }
        } else {
            //RELEASE THE KRAKEN
            rullingThemAllLikeAnFreakingOverlord();
        }
    });

}

var ticketRegex = /(#[0-9]+)/;

function cssEnhancment() {
    console.log('enhancing css');
    $("<style>")
        .prop("type", "text/css")
        .html("table.listing tr{font-size:10px;} .tickets tr.trac-columns th{font-size:10px;}")
        .appendTo("head");
}

function rullingThemAllLikeAnFreakingOverlord() {


    cssEnhancment();


    //TODO:: put those into config
    universalModule("#WorkInProgress");
    universalModule("#WaitingPullsReviews");
    universalModule("#ClosedTickets");

    universalModule("#Assigned");
    universalModule("#AcceptedWorkinprogress");
    universalModule("#YourWaitingPullReview");


    //workInProgress(ticketRegex);
}


function universalLoop(appendIdOverlord, index, row, current, summaryPosition, componentPosition, ticketRegex) {

    try {
        var ticketValidation = ticketRegex.exec(current.find('td').get(0).innerHTML)
    } catch (e) {
        ticketValidation = false;
    }

    if (ticketValidation) { //row[0] inner html  = #ticket
        var ticketId = ticketValidation[1];
        var component = current.find('td').get(componentPosition).innerText;
        var name = current.find('td').get(summaryPosition).innerText;

        var status = localStorage.getItem(ticketId + 'status') || '--';
        var statusUrl = localStorage.getItem(ticketId + 'url') || '';

        //tmp overdi before redis gives us update
        switch (status) {
            case 'OK':
                current.append('<td id="overlordId' + ticketId + '"><a href="' + statusUrl + '" target="_blank">OK</a></td>');
                break;

            case 'Fail':
                current.append('<td id="overlordId' + ticketId + '"><a href="' + statusUrl + '" target="_blank">FAIL</a></td>');
                break;

            default:
            case '--':
                current.append('<td id="overlordId' + ticketId + '">--</td>');
                break;
        }

        // %252F
        //component = 'downloader';
        //name = "feature%252Fproxy_module_lookup";

        setTimeout(function () { // nextTick basically, call Deadpoll
            $.getJSON('http://10.0.1.222:8080/job/Flubit/job/' + component + '/job/' + name.replace("\/", "%252F") + '/api/json'
                , null, function (objResponse) {
                    if (objResponse && objResponse.lastBuild) {
                        try {
                            var building = false;
                            var newStatus = '--';

                            if (objResponse.lastBuild && objResponse.lastStableBuild && objResponse.lastSuccessfulBuild &&
                                objResponse.lastBuild.number == objResponse.lastStableBuild.number &&
                                objResponse.lastBuild.number == objResponse.lastSuccessfulBuild.number) {
                                localStorage.setItem(ticketId + 'status', 'OK');
                                newStatus = 'OK';
                            } else {

                                if (checkBuildInProgress(objResponse)) {
                                    //do nothing we simply the regression
                                    //localStorage.setItem(ticketId + 'status', 'Building');
                                    //var newStatus = 'Building';

                                    newStatus = status;
                                    building = 'true';
                                } else {
                                    localStorage.setItem(ticketId + 'status', 'Fail');
                                    newStatus = 'Fail';
                                }

                            }

                            localStorage.setItem(ticketId + 'url', objResponse.lastBuild.url);
                            statusUrl = objResponse.lastBuild.url;

                            var statusStr = (newStatus === status ? status : status + ' > ' + newStatus)
                            if (building) {
                                $('#overlordId' + ticketId).html('<a href="' + statusUrl + '" target="_blank">Test</a>');
                            } else {
                                $('#overlordId' + ticketId).html('<a href="' + statusUrl + '" target="_blank">' + statusStr + '</a>');
                            }

                            if (status == 'OK' && newStatus === 'Fail') {
                                notifyMe("[REGRESION]:" + component + " \n " + name);
                            }

                            status = newStatus
                        } catch (e) {
                            console.log(e);
                            alert('CASE! CASE! EDGE CASE!');
                        }
                    } else {
                        // Plenty O`nothin
                    }
                });
        }, 1000);

    }
}

function checkBuildInProgress(obj) {
    if (obj.lastBuild) {

        if (obj.lastCompletedBuild && obj.lastCompletedBuild.number == obj.lastBuild.number) {
            return false;
        }

        if (obj.lastFailedBuild && obj.lastFailedBuild.number == obj.lastBuild.number) {
            return false;
        }

        if (obj.lastStableBuild && obj.lastStableBuild.number == obj.lastBuild.number) {
            return false;
        }

        if (obj.lastSuccessfulBuild && obj.lastSuccessfulBuild.number == obj.lastBuild.number) {
            return false;
        }

        if (obj.lastUnstableBuild && obj.lastUnstableBuild.number == obj.lastBuild.number) {
            return false;
        }

        if (obj.lastUnsuccessfulBuild && obj.lastUnsuccessfulBuild.number == obj.lastBuild.number) {
            return false;
        }

        return true;
    } else {

        return true; // nothing build yet
    }
}


function universalModule(moduleName) {
    $(moduleName).parent().find("div>table>thead>tr").append('<th>CI</th>');
    $(moduleName).parent().find("div>table>tbody>.trac-columns").append('<th>CI</th>');

    $(moduleName).parent().find("div>table>tbody>tr>th[colspan]").each(function (index, row) {
        var colspan = $(this).attr('colspan');
        $(this).attr('colspan', colspan * 1 + 1);
    });

    //get component summary order
    var summaryPosition = 1;
    var componentPosition = 3;

    $(moduleName).parent().find("div>table>thead>tr>th").each(function (index, row) {

        if ($(this)[0].className === "summary") {
            summaryPosition = index;
        }
        if ($(this)[0].className === "component") {
            componentPosition = index;
        }
    })

    var appendIdOverlord = 666;

    $(moduleName).parent().find("div>table>tbody>tr").each(function (index, row) {
        universalLoop(appendIdOverlord, index, row, $(this), summaryPosition, componentPosition, ticketRegex);
        appendIdOverlord++;
    });
}

