// Global Mediavida
var authors = document.querySelectorAll('[data-autor]');
const ignoredUser = JSON.parse(localStorage.getItem("ignoredUser"));
const highlightedUser = JSON.parse(localStorage.getItem("highlightedUser"));

// MV Premium CSS
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = chrome.runtime.getURL('./css/mvpremium.css');
if (window.localStorage.getItem("MvPremiumCSS") === 'true') {
    document.querySelector('body').classList.add('mvpremium');
}else{
    document.querySelector('body').classList.remove('mvpremium');

}

// Ignored users in threads
for (var i = 0, l = authors.length; i < l; i++) {
    if (ignoredUser && ignoredUser.includes(authors[i].getAttribute('data-autor'))) {
        authors[i].innerHTML = 'Mensaje ignorado';
    }
}

// Highlighted users in threads

for (var i = 0, l = authors.length; i < l; i++) {
    if (highlightedUser && highlightedUser.includes(authors[i].getAttribute('data-autor'))) {
        authors[i].style = 'border-left:10px #de6e17 solid; padding-left: 10px;';
    }
}
// Private messages
if (window.location.href.startsWith("https://www.mediavida.com/mensajes")) {
    const privateMessageList = document.querySelector("#pms > div.pm-col.c-side-alt > div.wpx > div > ul");
    var privateMessages = privateMessageList.querySelectorAll('strong');
    if (ignoredUser) {
        for (var i = 0, l = privateMessages.length; i < l; i++) {
            if (ignoredUser && ignoredUser.includes(privateMessages[i].textContent)) {
                privateMessages[i].parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML = '<div style="padding:20px;">Mensaje ignorado</div>';
            }
        }
    }
}
// Signature
if (window.location.href.startsWith("https://www.mediavida.com/id")) {
    const SignatureList = document.querySelector(".firmas");
    if (SignatureList) {
        var signatures = SignatureList.querySelectorAll('.autor');
        for (var i = 0, l = signatures.length; i < l; i++) {
            if (ignoredUser && ignoredUser.includes(signatures[i].textContent)) {
                signatures[i].parentNode.parentNode.parentNode.innerHTML = 'Firma ignorada';
            }
        }
    }
}


// Configuration page
if (window.location.href.startsWith("https://www.mediavida.com/configuracion")) {

    var newFieldset = document.createElement('fieldset');
    newFieldset.style = "border: 1px #ccc solid;padding-bottom: 40px;margin-bottom: 20px;width: 80%;margin-left: 10%;";
    // Header logo
    newFieldset.innerHTML += `<h2 class="align" style="margin-top:30px;"><img src="https://i.imgur.com/xbirbIk.png" style="max-width:250px;"></h2>`;

    // Add MV Premium CSS
    newFieldset.innerHTML += `
        <div class="control-label" style="margin-bottom: 20px;">
        <h4>Activar estilos <br> <a href="https://www.mediavida.com/foro/mediavida/estilos-mv7-581940#8" target="_blank">MV Premium</a></h4>
        </div>
        <div class="control-input" style="margin-bottom: 20px;">
            <label class="switch" for="checkbox">
            <input type="checkbox" id="checkbox"
            ${window.localStorage.getItem('MvPremiumCSS') === 'true' ? 'checked' : ''}>
            <div class="slider round"></div>
        </label>
        <a href="#!" class="tooltipAnchor" data-tooltip="Se recomienda usar el Theme de Mediavida Oscuro cuando se activan los estilos de MV Premium ">?</a>
        </div>
    `

    // Ignore user
    newFieldset.innerHTML += `<hr style="color:#ccc">
                    <div class="control-label" style="margin-bottom: 20px;">
                    <h4>Ignorar usuario</h4>
                    </div>
                    <div class="control-input" style="margin-bottom: 20px;">
                    <input type="text" name="url" placeholder="Nick usuario" id="ignoreUserInput">
                    <button type="button" class="btn" id="ignoreUserBtn">Ignorar</button>
                    </div>
                    `;
    if (ignoredUser) {
        for (var i = 0; i < ignoredUser.length; i++) {
            newFieldset.innerHTML += `<div class="control-label" style="margin-bottom: 10px;"><span>${ignoredUser[i]}</span></div><div class="control-input" style="padding-left:0; margin-bottom: 10px;"><span type="button" class="btn btn-danger" onClick='let ignoredUsers = JSON.parse(window.localStorage.getItem("ignoredUser"));
            ignoredUsers.splice(${i}, 1);
            window.localStorage.setItem("ignoredUser", JSON.stringify(ignoredUsers));
            location.reload();'>Borrar</span></div>`;
        }
    }
    newFieldset.innerHTML += `<hr style="color:#ccc">
    <div class="control-label" style="margin-bottom: 20px;">
    <h4>Destacar usuario</h4>
    </div>
    <div class="control-input" style="margin-bottom: 20px;">
    <input type="text" name="url" placeholder="Nick usuario" id="highlightUserInput">
    <span type="button" class="btn" id="highlightUserBtn">Destacar</span>
    </div>
`
    if (highlightedUser) {
        for (var i = 0; i < highlightedUser.length; i++) {
            newFieldset.innerHTML += `<div class="control-label" style="margin-bottom: 10px;"><span>${highlightedUser[i]}</span></div>
        <div class="control-input" style="padding-left:0; margin-bottom: 10px;"><span type="button" class="btn btn-danger" onClick='
        let highlightedUsers = JSON.parse(window.localStorage.getItem("highlightedUser"));
        highlightedUsers.splice(${i}, 1);
        window.localStorage.setItem("highlightedUser", JSON.stringify(highlightedUsers));
        location.reload();'
        >Borrar</span></div>`;
        }
    }
    var secondFieldset = document.getElementsByTagName('fieldset')[1];
    if (secondFieldset) {
        secondFieldset.parentNode.insertBefore(newFieldset, secondFieldset.nextSibling);
    }
}
document.querySelector('#checkbox').addEventListener('click', function (e) {
    return HandleOnChangeMvPremium(document.getElementById('checkbox').checked);
});

document.querySelector('#highlightUserBtn').addEventListener('click', function (e) {
    return HandleAddHighlightUser();
});

document.querySelector('#ignoreUserBtn').addEventListener('click', function (e) {
    return HandleAddIgnoredUser();
});