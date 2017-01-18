/**
 * Created by Dev-Bart on 14/07/2016.
 */


$(document).ready(
    function () {
        $.getJSON("http://jenkins-internalservices.flubdev.info/job/Flubit/api/json", function (data) {

            var lookUp = {};
            for (var i = 0; i < data.jobs.length; i++) {
                lookUp[data.jobs[i].name] = i;

                $('body').append('<h4>' + data.jobs[i].name + '<h3><div class="jenkins-entry" id="jenkins-' + data.jobs[i].name + '"></div>');

                $("#jenkins-" + data.jobs[i].name).load("http://jenkins-internalservices.flubdev.info/job/Flubit/job/" + data.jobs[i].name + " #projectstatus", function (response) {
                    $(".healthReportDetails").remove();
                    $("#projectstatus>tbody>tr>td:nth-child(4)").remove();
                    $("#projectstatus>tbody>tr>td:nth-child(4)").remove();
                    $("#projectstatus>tbody>tr>td:nth-child(4)").remove();
                    $("#projectstatus>tbody>tr>td:nth-child(4)").remove();
                    $(".header").remove();


                    $('#projectstatus>tbody>tr>td:nth-child(1)>img.icon-blue').attr('src', "images/jenkins-icon-blue.png");
                    $('#projectstatus>tbody>tr>td:nth-child(1)>img.icon-yellow').attr('src', "images/jenkins-icon-yellow.png");
                    $('#projectstatus>tbody>tr>td:nth-child(1)>img.icon-red').attr('src', "images/jenkins-icon-red.png");

                    $('#projectstatus>tbody>tr>td:nth-child(1)>img.icon-blue-anime').attr('src', "images/jenkins-blue_anime.gif");
                    $('#projectstatus>tbody>tr>td:nth-child(1)>img.icon-yellow-anime').attr('src', "images/jenkins-yellow_anime.gif");
                    $('#projectstatus>tbody>tr>td:nth-child(1)>img.icon-red-anime').attr('src', "images/jenkins-red_anime.gif");


                    $('#projectstatus>tbody>tr>td:nth-child(2)>a>img.icon-health-80plus').attr('src', "images/jenkins-health-80plus.png");
                    $('#projectstatus>tbody>tr>td:nth-child(2)>a>img.icon-health-60to79').attr('src', "images/jenkins-health-60to79.png");
                    $('#projectstatus>tbody>tr>td:nth-child(2)>a>img.icon-health-40to59').attr('src', "images/jenkins-health-40to59.png");
                    $('#projectstatus>tbody>tr>td:nth-child(2)>a>img.icon-health-20to39').attr('src', "images/jenkins-health-20to39.png");
                    $('#projectstatus>tbody>tr>td:nth-child(2)>a>img.icon-health-00to19').attr('src', "images/jenkins-health-00to19.png");

                    $('#projectstatus a').attr("href", "#");

                });
                /*
                 $.getJSON("http://jenkins-internalservices.flubdev.info/job/Flubit/job/" + data.jobs[i].name + "/api/json", function (workData) {





                 for (var j = 0; j < workData.jobs.length; j++) {




                 var status = 0;

                 var weather = 0;

                 $('#jenkins-' + workData.name).append('<tr><td>' + status + '</td><td>' + weather + '</td><td>' + workData.jobs[j].name.replace('%2F', "/") + '</td></tr>');



                 });
                 */


            }

        })

    }
);


