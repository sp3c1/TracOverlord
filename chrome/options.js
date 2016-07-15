// Saves options to chrome.storage
function save_options() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('pass').value;

    localStorage.setItem('Overlord_User_Ldap', user);
    localStorage.setItem('Overlord_Pass_Ldap', pass);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    document.getElementById('username').value = localStorage.getItem('Overlord_User_Ldap');
    document.getElementById('pass').value = localStorage.getItem('Overlord_Pass_Ldap');

}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);