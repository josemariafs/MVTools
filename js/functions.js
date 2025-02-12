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
function HandleOnChangeHideBg(checked){
    checked ? window.localStorage.setItem('MvPremiumCSSWithoutBG', 'true') : window.localStorage.setItem('MvPremiumCSSWithoutBG', 'false'); 
    location.reload();
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


function HandleOnChangeUltrawide(checked){
    checked ? window.localStorage.setItem('mvultrawide', 'true') : window.localStorage.setItem('mvultrawide', 'false'); 
    location.reload();
}

function exportConfig(){

    let config = {
        MvPremiumCSS: window.localStorage.getItem('MvPremiumCSS'),
        ShowIgnoredUsers: window.localStorage.getItem('ShowIgnoredUsers'),
        MvPremiumCSSWithoutBG: window.localStorage.getItem('MvPremiumCSSWithoutBG'),
        showIpsWithoutClons: window.localStorage.getItem('showIpsWithoutClons'),
        mvultrawide: window.localStorage.getItem('mvultrawide'),
        highlightedUser: JSON.parse(window.localStorage.getItem("highlightedUser")),
        ignoredUser: JSON.parse(window.localStorage.getItem("ignoredUser")),
        notedUser: JSON.parse(window.localStorage.getItem("notedUser"))
    }
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importConfig(){
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => { 
        let file = e.target.files[0]; 
        let reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let config = JSON.parse(content);
            window.localStorage.setItem('MvPremiumCSS', config.MvPremiumCSS);
            window.localStorage.setItem('ShowIgnoredUsers', config.ShowIgnoredUsers);
            window.localStorage.setItem('MvPremiumCSSWithoutBG', config.MvPremiumCSSWithoutBG);
            window.localStorage.setItem('showIpsWithoutClons', config.showIpsWithoutClons);
            window.localStorage.setItem('mvultrawide', config.mvultrawide);
            window.localStorage.setItem('highlightedUser', JSON.stringify(config.highlightedUser));
            window.localStorage.setItem('ignoredUser', JSON.stringify(config.ignoredUser));
            window.localStorage.setItem('notedUser', JSON.stringify(config.notedUser));
            location.reload();
        }
    }
    input.click();
}