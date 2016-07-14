/**
 * Created by Dev-Bart on 14/07/2016.
 */

createNotification();

function createNotification() {
    var opt = {type: "basic", title: "Your Title", message: "Your message", iconUrl: "your_icon.png"}
    chrome.notifications.create("notificationName", opt, function () {
        alert(2);
    });
}

//include this line if you want to clear the notification after 5 seconds
/*
 setTimeout(function () {
 chrome.notifications.clear("notificationName", function () {
 });
 }, 500);
 */