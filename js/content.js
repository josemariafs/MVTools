// Global Mediavida
var authors = document.querySelectorAll("[data-autor]");
const ignoredUser = JSON.parse(localStorage.getItem("ignoredUser"));
const notedUser = JSON.parse(localStorage.getItem("notedUser"));
const highlightedUser = JSON.parse(localStorage.getItem("highlightedUser"));
const replies = document.querySelectorAll(".replies");

// MV Premium CSS
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = chrome.runtime.getURL("./css/mvpremium.css");
if (window.localStorage.getItem("MvPremiumCSS") === "true") {
  document.querySelector("body").classList.add("mvpremium");
} else {
  document.querySelector("body").classList.remove("mvpremium");
}
if (window.localStorage.getItem("MvPremiumCSSWithoutBG") === "true") {
  document.querySelector("body").classList.add("MvPremiumCSSWithoutBG");
}

// Bans options
if (window.location.href.startsWith("https://www.mediavida.com/usuarios/ban.php")) {
  const element =  document.getElementsByClassName("control-group")[2]
  if (element) {
      let div = document.createElement("div");
      div.className = "control-group";
      div.style = " overflow:visible";
      div.innerHTML = `<label for="motivo" class="control-label">Selector Motivo</label>
      <div class="control-input">
      <span onClick='document.querySelector("textarea").value = "Multicuenta";' style="margin-right:10px; padding:8px;background: #434343;border-radius: 5px; cursor:pointer;    BORDER: 1px #7d7d7d solid;">Multicuenta</span>
      <span onClick='document.querySelector("textarea").value = "Spam / Troll";'  style="margin-right:10px; padding:8px;background: #434343;border-radius: 5px; cursor:pointer;    BORDER: 1px #7d7d7d solid;">Spam / Troll</span>
      <span onClick='document.querySelector("textarea").value = "Mensajes de odio, acoso y/o discriminación";' style="margin-right:10px; padding:8px;background: #434343;border-radius: 5px; cursor:pointer;    BORDER: 1px #7d7d7d solid;">Mensajes de odio, acoso y/o discriminación</span>
      <span onClick='document.querySelector("textarea").value = "Insultos en MD, firmas o público";' style="margin-right:10px; padding:8px;background: #434343;border-radius: 5px; cursor:pointer;    BORDER: 1px #7d7d7d solid;">Insultos en MD, firmas o público</span>
      <span onClick='document.querySelector("textarea").value = "A petición del usuario";' style="margin-right:10px; padding:8px;background: #434343;border-radius: 5px; cursor:pointer;    BORDER: 1px #7d7d7d solid;">A petición del usuario</span>      
      </div>`
      element.parentNode.insertBefore(div, element);
  }
  }

// Add Tooltip to users
for (var i = 0, l = authors.length; i < l; i++) {
  if (
    notedUser &&
    notedUser.some(
      (user) => user.nickname === authors[i].getAttribute("data-autor")
    )
  ) {
    var userNote = notedUser.find(
      (user) => user.nickname === authors[i].getAttribute("data-autor")
    ).note;
    var postAvatar = authors[i].querySelector(".post-avatar");
    if (postAvatar) {
      postAvatar.innerHTML += `<a href="#!" class="tooltipAnchor" data-tooltip="${userNote}"><img src="${chrome.runtime.getURL(
        "img/note2.png"
      )}"/></a>`;
    }
  }
}

// Ignored users in threads
if (window.localStorage.getItem("ShowIgnoredUsers") === "false") {
  for (var i = 0, l = authors.length; i < l; i++) {
    if (
      ignoredUser &&
      ignoredUser.includes(authors[i].getAttribute("data-autor"))
    ) {
      authors[i].innerHTML = "Mensaje ignorado";
    }
  }
} else {
  for (var i = 0, l = authors.length; i < l; i++) {

    if (
      ignoredUser &&
      ignoredUser.includes(authors[i].getAttribute("data-autor"))
    ) {
      authors[i].getElementsByClassName("post-avatar")[0].style =
        "display:none;";
      authors[i].getElementsByClassName("post-body")[0].style = "display:none;";
      let author = authors[i];
      author.innerHTML += `<button class="mensajeIgnorado" onClick="
            this.style.display = 'none';
            document.querySelectorAll('[data-autor]')['${i}'].getElementsByClassName('post-body')[0].style = 'display:block';
            document.querySelectorAll('[data-autor]')['${i}'].getElementsByClassName('post-avatar')[0].style = 'display:block';
            ">Mostrar mensaje ignorado</button>`;
    }
  }
}

// Ignored users in replies
document.querySelectorAll(".btnrep").forEach((btn) => {
  btn.addEventListener("click", function () {
    setTimeout(() => {
      document.querySelectorAll(".replies").forEach((reply) => {
        reply.querySelectorAll(".rep").forEach((rep) => {
          console.log(ignoredUser)
        if (rep && ignoredUser && ignoredUser.includes(rep.querySelector('.autor').textContent)) {
          rep.innerHTML = "Mensaje ignorado";
        }
      });
    });
  }, 500);

  });
});
// Highlighted users in threads

for (var i = 0, l = authors.length; i < l; i++) {
  if (
    highlightedUser &&
    highlightedUser.includes(authors[i].getAttribute("data-autor"))
  ) {
    authors[i].style = "border-left:10px #de6e17 solid; padding-left: 10px;";
  }
}
// Private messages
if (window.location.href.startsWith("https://www.mediavida.com/mensajes")) {
  const privateMessageList = document.querySelector(
    "#pms > div.pm-col.c-side-alt > div.wpx > div > ul"
  );
  var privateMessages = privateMessageList.querySelectorAll("strong");
  if (ignoredUser) {
    for (var i = 0, l = privateMessages.length; i < l; i++) {
      if (ignoredUser && ignoredUser.includes(privateMessages[i].textContent)) {
        privateMessages[
          i
        ].parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML =
          '<div style="padding:20px;">Mensaje ignorado</div>';
      }
    }
  }
}
// Signature
if (window.location.href.startsWith("https://www.mediavida.com/id")) {
  const SignatureList = document.querySelector(".firmas");
  if (SignatureList) {
    var signatures = SignatureList.querySelectorAll(".autor");
    for (var i = 0, l = signatures.length; i < l; i++) {
      if (ignoredUser && ignoredUser.includes(signatures[i].textContent)) {
        signatures[i].parentNode.parentNode.parentNode.innerHTML =
          "Firma ignorada";
      }
    }
  }

  const notesContent = document.querySelectorAll("#notes .ncontent li");
  const currentDate = new Date();

  notesContent.forEach((li) => {
    const datePattern = /hasta\s(\d{1,2})\/(\d{1,2})\/(\d{2})/;
    const match = li.textContent.match(datePattern);

    if (match) {
      const [_, day, month, year] = match;
      const noteDate = new Date(`20${year}`, month - 1, day);
      console.log("noteDate, currentDate");
      console.log(noteDate, currentDate);
      if (noteDate > currentDate) {
        li.style.color = "red";
      }
    }
  });

}

// Admin tools

if (
  window.location.href.startsWith("https://www.mediavida.com/usuarios/admin")
) {
  document.querySelector("body").classList.add("mvAdminTools");
  const checkElements = document.getElementsByClassName("pairs");
  for (var i = 0; i < checkElements.length; i++) {
    if (checkElements[i].childNodes[1].checked === true) {
      checkElements[i].classList.add("checked");
    } else {
      checkElements[i].classList.add("unchecked");
    }
  }
}
if (
  window.location.href.startsWith("https://www.mediavida.com/foro/admin")
) {
  document.querySelector("body").classList.add("mvAdminTools");
}

  
  if (
    window.location.href.startsWith("https://www.mediavida.com/foro/admin_edit.php")
  ) {
    document.querySelector("body").classList.add("mvAdminTools");

    let labels = document.querySelectorAll("#foro label");
    labels.forEach(label => {
      label.classList.add("col1");
    });

    let inputs = document.querySelectorAll("#foro input");
    inputs.forEach(input => {
      input.classList.add("col2");
    });

    labels = document.querySelectorAll("#mods label");
    labels.forEach(label => {
      label.classList.add("col1");
    });

    inputs = document.querySelectorAll("#mods input");
    inputs.forEach(input => {
      input.classList.add("col2");
    });

  }

  



  if (
    window.location.href.startsWith("https://www.mediavida.com/foro/staff.php")
  ) {
    document.querySelector("body").classList.add("mvAdminTools");
    const h3Elements = document.querySelectorAll("#p0 h3");
    h3Elements.forEach((h3, index) => {
        const div = document.createElement("div");
        div.setAttribute("data-index", index);
        const ulElements = document.querySelectorAll("#p0 ul");
        const ul = ulElements[index];
        h3.parentNode.insertBefore(div, h3);
        ul.parentNode.insertBefore(div, ul);
        div.appendChild(h3);
        div.appendChild(ul);
    });
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.src.includes("/style")) {
        img.src = img.src.replace("/style", "/");
      }
    });

    const p1Element = document.getElementById("p1");
    if (p1Element) {
      const liElements = p1Element.querySelectorAll("li");
      liElements.forEach((li) => {
        const div = document.createElement("div");
        div.innerHTML = li.innerHTML;
        li.parentNode.replaceChild(div, li);
      });
    }

    let newLi = document.createElement("li");
    let newA = document.createElement("a");
    let linkPanel = document.getElementById("linkpanel");

    newA.href = "#";
    newA.textContent = "Administradores";
    newLi.appendChild(newA);
    linkPanel.appendChild(newLi);

    newLi = document.createElement("li");
    newA = document.createElement("a");
    newA.href = "#";
    newA.textContent = "MODS sin acceso al foro interno";
    newLi.appendChild(newA);
    linkPanel.appendChild(newLi);

    newLi = document.createElement("li");
    newA = document.createElement("a");
    newA.href = "#";
    newA.textContent = "Users NO MODS con acceso al foro interno";
    newLi.appendChild(newA);
    linkPanel.appendChild(newLi);

    let largecolFirstChild = document.querySelector(".largecol");
    let p1Divs = document.querySelectorAll("#p1 div");
    let p3Div = document.createElement("div");
    p3Div.id = "p3";

    p1Divs.forEach((div) => {
      if (div.textContent.includes("Administrador")) {
        p3Div.appendChild(div.cloneNode(true));
      }
    });
    largecolFirstChild.appendChild(p3Div);

    let p4Div = document.createElement("div");
    p4Div.id = "p4";

    p1Divs.forEach((div) => {
      if (div.textContent.includes("Moderador") && !div.textContent.includes("Foro Interno")) {
        p4Div.appendChild(div.cloneNode(true));
      }
    });
    largecolFirstChild.appendChild(p4Div);

    let p5Div = document.createElement("div");
    p5Div.id = "p5";

    p1Divs.forEach((div) => {
      if (!div.textContent.includes("Moderador") && div.textContent.includes("Foro Interno")) {
        p5Div.appendChild(div.cloneNode(true));
      }
    });
    largecolFirstChild.appendChild(p5Div);    

    if (linkPanel) {
      const liElements = linkPanel.getElementsByTagName("li");
      if (liElements.length > 1) {
        liElements[0].addEventListener("click", function () {
          document.getElementById("p0").style.display = "block";
          document.getElementById("p1").style.display = "none";
          document.getElementById("p2").style.display = "none";
          document.getElementById("p3").style.display = "none";
          document.getElementById("p4").style.display = "none";
          document.getElementById("p5").style.display = "none";
          liElements[0].classList.add("selected");
          liElements[1].classList.remove("selected");
          liElements[2].classList.remove("selected");
          liElements[3].classList.remove("selected");
          liElements[4].classList.remove("selected");
          liElements[5].classList.remove("selected");
        });
        liElements[1].addEventListener("click", function () {
          document.getElementById("p0").style.display = "none";
          document.getElementById("p1").style.display = "block";
          document.getElementById("p2").style.display = "none";
          document.getElementById("p3").style.display = "none";
          document.getElementById("p4").style.display = "none";
          document.getElementById("p5").style.display = "none";
          liElements[0].classList.remove("selected");
          liElements[1].classList.add("selected");
          liElements[2].classList.remove("selected");
          liElements[3].classList.remove("selected");
          liElements[4].classList.remove("selected");
          liElements[5].classList.remove("selected");
        });
        liElements[2].addEventListener("click", function () {
          document.getElementById("p0").style.display = "none";
          document.getElementById("p1").style.display = "none";
          document.getElementById("p2").style.display = "block";
          document.getElementById("p3").style.display = "none";
          document.getElementById("p4").style.display = "none";
          document.getElementById("p5").style.display = "none";
          liElements[0].classList.remove("selected");
          liElements[1].classList.remove("selected");
          liElements[2].classList.add("selected");
          liElements[3].classList.remove("selected");
          liElements[4].classList.remove("selected");
          liElements[5].classList.remove("selected");
        });        
        liElements[3].addEventListener("click", function () {
          document.getElementById("p0").style.display = "none";
          document.getElementById("p1").style.display = "none";
          document.getElementById("p2").style.display = "none";
          document.getElementById("p3").style.display = "block";
          document.getElementById("p4").style.display = "none";
          document.getElementById("p5").style.display = "none";
          liElements[0].classList.remove("selected");
          liElements[1].classList.remove("selected");
          liElements[2].classList.remove("selected");
          liElements[3].classList.add("selected");
          liElements[4].classList.remove("selected");
          liElements[5].classList.remove("selected");

        });
        liElements[4].addEventListener("click", function () {
          document.getElementById("p0").style.display = "none";
          document.getElementById("p1").style.display = "none";
          document.getElementById("p2").style.display = "none";
          document.getElementById("p3").style.display = "none";
          document.getElementById("p4").style.display = "block";
          document.getElementById("p5").style.display = "none";
          liElements[0].classList.remove("selected");
          liElements[1].classList.remove("selected");
          liElements[2].classList.remove("selected");
          liElements[3].classList.remove("selected");
          liElements[4].classList.add("selected");
          liElements[5].classList.remove("selected");
        });  
        liElements[5].addEventListener("click", function () {
          document.getElementById("p0").style.display = "none";
          document.getElementById("p1").style.display = "none";
          document.getElementById("p2").style.display = "none";
          document.getElementById("p3").style.display = "none";
          document.getElementById("p4").style.display = "none";
          document.getElementById("p5").style.display = "block";
          liElements[0].classList.remove("selected");
          liElements[1].classList.remove("selected");
          liElements[2].classList.remove("selected");
          liElements[3].classList.remove("selected");
          liElements[4].classList.remove("selected");
          liElements[5].classList.add("selected");
        });                
      }
    }

  }
  
if (window.location.href.startsWith("https://www.mediavida.com/id")) {
  document.querySelectorAll("div").forEach((div) => {
    const leftElement = div.querySelector(".left");
    if (leftElement && leftElement.tagName.toLowerCase() === "div") {
      leftElement.style =
        "width: 77%; background: #3e3e3ecf; padding: 15px; border-radius: 5px; margin-bottom: 10px; border: 1px #656565 solid; float:left";
    }
  });
  document.querySelector(".left").nextElementSibling.style =
    "width:20%;float:left;";
  document
    .querySelector(".left")
    .nextElementSibling.querySelectorAll("li")[0].style =
    "margin: 10px; background: #3e3e3ecf; border-radius: 3px; border: 1px #656565 solid; padding: 5px; text-align: center; color:white !important";
  document
    .querySelector(".left")
    .nextElementSibling.querySelectorAll("li")[1].style =
    "margin: 10px; background: #3e3e3ecf; border-radius: 3px; border: 1px #656565 solid; padding: 5px; text-align: center; color:white !important";
  document
    .querySelector(".left")
    .nextElementSibling.querySelectorAll("li")[2].style =
    "margin: 10px; background: #3e3e3ecf; border-radius: 3px; border: 1px #656565 solid; padding: 5px; text-align: center; color:white !important";
}

if (window.location.href.startsWith("https://www.mediavida.com/foro/admin")) {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (img.src.includes("/style")) {
      img.src = img.src.replace("/style", "/");
    }
  });
}

if (
  window.location.href.startsWith("https://www.mediavida.com/usuarios/clones")
) {
  document.querySelector("body").classList.add("mvAdminTools");

  const eqcolElements = document.querySelectorAll(".eqcol");
  eqcolElements.forEach((element) => {
    if (element.classList.length === 1) {
      element.classList.add("busted");
    }
  });

  const bustedElements = document.querySelectorAll("ul li");
  bustedElements.forEach((li) => {
    if (li.innerHTML.includes("<strong>b</strong>")) {
      li.innerHTML = li.innerHTML.replace(
        "<strong>b</strong>",
        "<span style='background: #af2727;padding: 1px 5px;border-radius: 5px;'>BANNED</span>"
      );
    }
      if (li.innerHTML.includes("<strong>p</strong>")) {
        li.innerHTML = li.innerHTML.replace(
          "<strong>p</strong>",
          "<span style='background:rgb(52 88 143);padding: 1px 5px;border-radius: 5px;'>Sanción activa</span>"
        );      
    }
    if (li.innerHTML.includes("<strong>d</strong>")) {
      li.innerHTML = li.innerHTML.replace(
        "<strong>d</strong>",
        "<span style='background:rgb(45, 45, 45);padding: 1px 5px;border-radius: 5px;'>Cuenta desactivada</span>"
      );      
  }
  });

  if (window.localStorage.getItem("showIpsWithoutClons") === "false") {
    for (
      var i = 0;
      i <
      document.getElementsByClassName("box")[0].getElementsByTagName("div")
        .length;
      i++
    ) {
      if (
        document.getElementsByClassName("box")[0].getElementsByTagName("div")[i]
      ) {
        if (
          document
            .getElementsByClassName("box")[0]
            .getElementsByTagName("div")
            [i].textContent.includes("ninguno")
        ) {
          document.getElementsByClassName("box")[0].getElementsByTagName("div")[
            i
          ].style.display = "none";
        }
      }
    }
  }



  var newFieldset = document.createElement("fieldset");

  newFieldset.innerHTML += `
        <div style=" background: rgba(0, 0, 0, 0.5) !important; width: max-content; width: max-content; padding: 0px 25px; border-radius: 0px 0px 0px 10px; height: 40px; float:left">
        <div class="control-label" style="margin-bottom: 20px;">
        <h4>Mostrar IPs sin clones <br> <a href="https://www.mediavida.com/foro/mediavida/estilos-mv7-581940#8" target="_blank">MV Premium</a></h4>
        </div>
        <div class="control-input" >
            <label class="switch" for="show-all-ips">
            <input type="checkbox"  id="show-all-ips"
            ${
              window.localStorage.getItem("showIpsWithoutClons") === "true"
                ? "checked"
                : ""
            }>
            <div class="slider round"></div>
        </label>
        <a href="#!" class="tooltipAnchorConfig" data-tooltip="[SOLO ADMINS] Muestra todas las ips del usuario aunque no tengan clones coincidentes. ">?</a>
        </div>
        </div>
                <div style=" background: rgba(0, 0, 0, 0.5) !important; width: max-content; width: max-content; padding: 0px 25px; border-radius: 0px 0px 10px 0px; height: 40px; float:left">
        </div>
    `;
  var secondFieldset = document.getElementsByTagName("form")[1];
  if (secondFieldset) {
    secondFieldset.parentNode.insertBefore(
      newFieldset,
      secondFieldset.nextSibling
    );
  }
}
// Configuration page
if (
  window.location.href.startsWith("https://www.mediavida.com/configuracion")
) {
  var newFieldset = document.createElement("fieldset");
  newFieldset.style =
    "border: 1px #ccc solid;padding-bottom: 40px;margin-bottom: 20px;width: 80%;margin-left: 10%;";
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
            ${
              window.localStorage.getItem("MvPremiumCSS") === "true"
                ? "checked"
                : ""
            }>
            <div class="slider round"></div>
        </label>
        <a href="#!" class="tooltipAnchorConfig" data-tooltip="Se recomienda usar el Theme de Mediavida Oscuro cuando se activan los estilos de MV Premium ">?</a>
        </div>
    `;

    // Quitar fondo de MV Premium
if (window.localStorage.getItem("MvPremiumCSS") === "true"){
    newFieldset.innerHTML += `
    <hr>
    <div class="control-label" style="margin-bottom: 20px;">
    <h4>Quitar fondo MV Premium <br> </h4>
    </div>
    <div class="control-input" style="margin-bottom: 20px;">
        <label class="switch" for="checkbox-without-bg">
        <input type="checkbox" id="checkbox-without-bg"
        ${
          window.localStorage.getItem("MvPremiumCSSWithoutBG") === "true"
            ? "checked"
            : ""
        }>
        <div class="slider round"></div>
    </label>
    <a href="#!" class="tooltipAnchorConfig" data-tooltip="Se recomienda usar el Theme de Mediavida Oscuro cuando se activan los estilos de MV Premium ">?</a>
    </div>
`;
}

  // Ignore user
  newFieldset.innerHTML += `<hr style="color:#ccc">`;

  // Show ignored users
  newFieldset.innerHTML += `
        <div class="control-label" style="margin-bottom: 20px;">
        <h4>Ver mensajes ignorados</h4>
        </div>
        <div class="control-input" style="margin-bottom: 20px;">
            <label class="switch" for="checkbox-showIgnoredUsers">
            <input type="checkbox" id="checkbox-showIgnoredUsers"
            ${
              window.localStorage.getItem("ShowIgnoredUsers") === "true"
                ? "checked"
                : ""
            }>
            <div class="slider round"></div>
        </label>
        <a href="#!" class="tooltipAnchorConfig" data-tooltip="Si esta opción está activada se podrá mostrar mensajes de usuarios ignorados">?</a>
        </div>
    `;
  newFieldset.innerHTML += `<hr style="color:#ccc">`;

  newFieldset.innerHTML += `

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

  // Note user
  newFieldset.innerHTML += `<hr style="color:#ccc">
        <div class="control-label">
        <h4>Añadir notas a usuario</h4>
        </div>
        <div class="control-input" style="margin-bottom: 20px;">
        <input type="text" name="user" placeholder="Nick usuario" id="notedUserInput">
        <input type="text" name="note" placeholder="Notas" id="notedTextInput" maxlength="50">
        <button type="button" class="btn" id="notedUserBtn">Añadir nota</button>
        </div>
        `;
  if (notedUser) {
    for (var i = 0; i < notedUser.length; i++) {
      newFieldset.innerHTML += `<div class="control-label" style="margin-bottom: 10px;"><span>${notedUser[i].nickname}</span></div><div class="control-input" style="padding-left:0; margin-bottom: 10px;"><span class="note">${notedUser[i].note}</span><span type="button" class="btn btn-danger" onClick='let notedUsers = JSON.parse(window.localStorage.getItem("notedUser"));
            notedUsers.splice(${i}, 1);
            window.localStorage.setItem("notedUser", JSON.stringify(notedUsers));
            location.reload();'>Borrar</span></div>`;
    }
  }

  //Highlight user
  newFieldset.innerHTML += `<hr style="color:#ccc">
    <div class="control-label" style="margin-bottom: 20px;">
    <h4>Destacar usuario</h4>
    </div>
    <div class="control-input" style="margin-bottom: 20px;">
    <input type="text" name="url" placeholder="Nick usuario" id="highlightUserInput">
    <span type="button" class="btn" id="highlightUserBtn">Destacar</span>
    </div>
`;
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
  var secondFieldset = document.getElementsByTagName("fieldset")[1];
  if (secondFieldset) {
    secondFieldset.parentNode.insertBefore(
      newFieldset,
      secondFieldset.nextSibling
    );
  }
}
if (
  window.location.href.startsWith("https://www.mediavida.com/usuarios/clones")
) {
  document
    .querySelector("#show-all-ips")
    .addEventListener("click", function (e) {
      return HandleOnChangeShowIpsWithoutClons(
        document.getElementById("show-all-ips").checked
      );
    });
}
if (
  window.location.href.startsWith("https://www.mediavida.com/configuracion")
) {
  document.querySelector("#checkbox").addEventListener("click", function (e) {
    return HandleOnChangeMvPremium(document.getElementById("checkbox").checked);
  });

  document
    .querySelector("#checkbox-without-bg")
    .addEventListener("click", function (e) {
      return HandleOnChangeHideBg(
        document.getElementById("checkbox-without-bg").checked
      );
    });


    document
    .querySelector("#checkbox-showIgnoredUsers")
    .addEventListener("click", function (e) {
      return HandleOnChangeShowIgnoredUsers(
        document.getElementById("checkbox-showIgnoredUsers").checked
      );
    });

  document
    .querySelector("#highlightUserBtn")
    .addEventListener("click", function (e) {
      return HandleAddHighlightUser();
    });

  document
    .querySelector("#ignoreUserBtn")
    .addEventListener("click", function (e) {
      return HandleAddIgnoredUser();
    });
  document
    .querySelector("#notedUserBtn")
    .addEventListener("click", function (e) {
      return HandleAddNoteUser();
    });

  if (document.querySelector("#ptabs")) {
    document.querySelector("#ptabs").addEventListener("click", function (e) {
      return HandleTabChangeAdmin();
    });
  }
}
