// Saves options to chrome.storage
function save_options() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('pass').value;

    chrome.storage.sync.set({
        Overlord_User_Ldap: user,
        Overlord_Pass_Ldap: pass
    }, function () {
        //success
    });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        Overlord_User_Ldap: '',
        Overlord_Pass_Ldap: ''
    }, function (items) {
        document.getElementById('username').value = items.Overlord_User_Ldap;
        document.getElementById('pass').value = items.Overlord_Pass_Ldap;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);