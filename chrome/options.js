// Saves options to chrome.storage
function save_options() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('pass').value;
    var url = document.getElementById('url').value;

    chrome.storage.sync.set({
        Overlord_User_Jenkins: user,
        Overlord_Pass_Jenkins: pass,
        Overlord_Url_Jenkins: url
    }, function () {
        //success
    });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        Overlord_User_Jenkins: '',
        Overlord_Pass_Jenkins: '',
        Overlord_Url_Jenkins: ''
    }, function (items) {
        document.getElementById('username').value = items.Overlord_User_Jenkins;
        document.getElementById('pass').value = items.Overlord_Pass_Jenkins;
        document.getElementById('url').value = items.Overlord_Url_Jenkins;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);