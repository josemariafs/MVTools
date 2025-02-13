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
    fetch('https://www.mediavida.com/usuarios/action/joincheck.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: `do=username&q=${highlightUser}`
    })
    .then(response => response.text())
    .then(data => {
        if (data.trim() === "1") {  
            let highlightedUsers = JSON.parse(window.localStorage.getItem("highlightedUser")) || [];
            highlightedUsers.push(highlightUser);
            window.localStorage.setItem("highlightedUser", JSON.stringify(highlightedUsers));
            location.reload(); 
        } else {
            alert("El usuario no existe.");
        }
    })
    .catch(error => {
        console.error('Error al verificar el usuario:', error);
        alert("Ocurrió un error al verificar el usuario.");
    });
}

function HandleAddIgnoredUser(){
    let ignoreUser = document.getElementById("ignoreUserInput").value;
    fetch('https://www.mediavida.com/usuarios/action/joincheck.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: `do=username&q=${ignoreUser}`
    })
    .then(response => response.text())
    .then(data => {
        if (data.trim() === "1") {  
            let ignoredUsers = JSON.parse(window.localStorage.getItem("ignoredUser")) || [];
            ignoredUsers.push(ignoreUser);
            window.localStorage.setItem("ignoredUser", JSON.stringify(ignoredUsers));
            location.reload();  
        } else {
            alert("El usuario no existe.");
        }
    })
    .catch(error => {
        console.error('Error al verificar el usuario:', error);
        alert("Ocurrió un error al verificar el usuario.");
    });
}

function HandleOnChangeHideBg(checked){
    checked ? window.localStorage.setItem('MvPremiumCSSWithoutBG', 'true') : window.localStorage.setItem('MvPremiumCSSWithoutBG', 'false'); 
    location.reload();
}

function HandleAddNoteUser(){
    let notedUser = document.getElementById("notedUserInput").value;
    let note = document.getElementById("notedTextInput").value;
    fetch('https://www.mediavida.com/usuarios/action/joincheck.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: `do=username&q=${notedUser}`
    })
    .then(response => response.text())
    .then(data => {
        if (data.trim() === "1") { 
            let notedUsers = JSON.parse(window.localStorage.getItem("notedUser")) || [];
            notedUsers.push({"nickname": notedUser, "note": note});
            window.localStorage.setItem("notedUser", JSON.stringify(notedUsers));
            location.reload(); 
        } else {
            alert("El usuario no existe.");
        }
    })
    .catch(error => {
        console.error('Error al verificar el usuario:', error);
        alert("Ocurrió un error al verificar el usuario.");
    });
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