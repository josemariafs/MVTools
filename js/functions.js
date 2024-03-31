function HandleOnChangeMvPremium(checked) {
    checked ? window.localStorage.setItem('MvPremiumCSS', 'true') : window.localStorage.setItem('MvPremiumCSS', 'false'); 
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