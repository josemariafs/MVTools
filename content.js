// Global Mediavida
var authors = document.querySelectorAll('[data-autor]');
const ignoredUser = JSON.parse(localStorage.getItem("ignoredUser"));
const highlightedUser = JSON.parse(localStorage.getItem("highlightedUser"));

for (var i = 0, l = authors.length; i < l; i++) {
    if (ignoredUser && ignoredUser.includes(authors[i].getAttribute('data-autor'))) {
        authors[i].innerHTML = 'Mensaje ignorado';
    }
}

for (var i = 0, l = authors.length; i < l; i++) {
    if (highlightedUser && highlightedUser.includes(authors[i].getAttribute('data-autor'))) {
        authors[i].style = 'border-left:10px #de6e17 solid; padding-left: 10px;';
    }
}

// Configuration page
if (window.location.href.startsWith("https://www.mediavida.com/configuracion")) {

    var newFieldset = document.createElement('fieldset');
    newFieldset.style = "border: 1px #ccc solid;padding-bottom: 40px;margin-bottom: 20px;width: 80%;margin-left: 10%;";
    newFieldset.innerHTML = `<h2 class="align" style="margin-top:30px;">RA_MeSiAs MV Tools</h2>
                    <div class="control-label" style="margin-bottom: 20px;">
                    <h4>Ignorar usuario</h4>
                    </div>
                    <div class="control-input" style="margin-bottom: 20px;">
                    <input type="text" name="url" placeholder="Nick usuario" id="ignoreUserInput">
                    <button type="button" class="btn" id="ignoreUserBtn" onClick='let ignoreUser = document.getElementById("ignoreUserInput").value;
                    let ignoredUsers = JSON.parse(window.localStorage.getItem("ignoredUser")) || [];
                    ignoredUsers.push(ignoreUser);
                    window.localStorage.setItem("ignoredUser", JSON.stringify(ignoredUsers));
                    location.reload();'>Ignorar</button>
                    </div>
                    `;
    if (ignoredUser){
        for (var i = 0; i < ignoredUser.length; i++){
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
    <button type="button" class="btn" id="highlightUserBtn" onClick='let highlightUser = document.getElementById("highlightUserInput").value;
    let highlightedUsers = JSON.parse(window.localStorage.getItem("highlightedUser")) || [];
    highlightedUsers.push(highlightUser);
    window.localStorage.setItem("highlightedUser", JSON.stringify(highlightedUsers));
    location.reload();'>Destacar</button>
    </div>
`
console.log("highlightedUser", highlightedUser);
if (highlightedUser){
    console.log("highlightedUse2r", highlightedUser);

    for (var i = 0; i < highlightedUser.length; i++){
        newFieldset.innerHTML += `<div class="control-label"><span>${highlightedUser[i]}</span></div><div class="control-input" style="padding-left:0"><span type="button" class="btn btn-danger" onClick='    let highlightedUser = JSON.parse(window.localStorage.getItem("highlightedUser"));
        highlightedUser.splice(${i}, 1);
        window.localStorage.setItem("highlightedUser", JSON.stringify(highlightedUser));
        location.reload();'>Borrar</span></div>`;
    }
}
    var secondFieldset = document.getElementsByTagName('fieldset')[1];
    if (secondFieldset) {
        secondFieldset.parentNode.insertBefore(newFieldset, secondFieldset.nextSibling);
    }
}
