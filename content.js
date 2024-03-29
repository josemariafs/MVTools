var authors = document.querySelectorAll('[data-autor]');
const ignoredUser = JSON.parse(localStorage.getItem("ignoredUser"));

for (var i = 0, l = authors.length; i < l; i++) {
    console.log(authors[i].getAttribute('data-autor'))
    if (ignoredUser && ignoredUser.includes(authors[i].getAttribute('data-autor'))) {
        authors[i].innerHTML = 'Mesaje ignorado';
    }
}

if (window.location.href.startsWith("https://www.mediavida.com/configuracion")) {

    var newDiv = document.createElement('fieldset');
    newDiv.style = "border: 1px #ccc solid;padding-bottom: 40px;margin-bottom: 20px;width: 80%;margin-left: 10%;";
    newDiv.innerHTML = `<h2 class="align" style="margin-top:30px;">RA_MeSiAs MV Tools</h2>
                    <div class="control-label">
                    <h4>Ignorar usuario</h4>
                    </div>
                    <div class="control-input">
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
            newDiv.innerHTML += `<div class="control-label"><span class="ignored">${ignoredUser[i]}</span></div><div class="control-input" style="padding-left:0"><span type="button" class="btn btn-danger" onClick='    let ignoredUsers = JSON.parse(window.localStorage.getItem("ignoredUser"));
            ignoredUsers.splice(${i}, 1);
            window.localStorage.setItem("ignoredUser", JSON.stringify(ignoredUsers));
            location.reload();'>Borrar</span></div>`;
        }
    }
    var secondFieldset = document.getElementsByTagName('fieldset')[1];
    if (secondFieldset) {
        secondFieldset.parentNode.insertBefore(newDiv, secondFieldset.nextSibling);
    }
}
