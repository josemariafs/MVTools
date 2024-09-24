function HandleOnChangeMvPremium(checked) {
    checked ? window.localStorage.setItem('MvPremiumCSS', 'true') : window.localStorage.setItem('MvPremiumCSS', 'false'); 
    location.reload();
}
function HandleOnChangeShowIgnoredUsers(checked) {
    checked ? window.localStorage.setItem('ShowIgnoredUsers', 'true') : window.localStorage.setItem('ShowIgnoredUsers', 'false'); 
        location.reload();
}

function HandleAddHighlightUser(){
    let highlightUser = document.getElementById("highlightUserInput").value;
    let highlightedUsers = JSON.parse(window.localStorage.getItem("highlightedUser")) || [];
    highlightedUsers.push(highlightUser);
    window.localStorage.setItem("highlightedUser", JSON.stringify(highlightedUsers));
    location.reload();
}
function HandleAddIgnoredUser(){
    let ignoreUser = document.getElementById("ignoreUserInput").value;
    let ignoredUsers = JSON.parse(window.localStorage.getItem("ignoredUser")) || [];
    ignoredUsers.push(ignoreUser);
    window.localStorage.setItem("ignoredUser", JSON.stringify(ignoredUsers));
    location.reload()
}

function HandleAddNoteUser(){
    let notedUser = document.getElementById("notedUserInput").value;
    let note = document.getElementById("notedTextInput").value;
    let notedUsers = JSON.parse(window.localStorage.getItem("notedUser")) || [];
    notedUsers.push({"nickname": notedUser, "note": note});
    window.localStorage.setItem("notedUser", JSON.stringify(notedUsers));
    location.reload();
}
function HandleOnChangeShowIpsWithoutClons(checked) {
    window.localStorage.setItem('showIpsWithoutClons', checked) 
    location.reload();
}

function HandleHideVpns(checked) {
    window.localStorage.setItem('hideVpns', checked) 
    location.reload();
}
