let GOOGLE_API_KEY = window.localStorage.getItem('apiKey') || ''

let API_REQUEST_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GOOGLE_API_KEY}`
let normas = `

- Respeta y no utilices términos despectivos.
No insultes a otros usuarios, ni utilices términos despectivos hacia ellos.

- No alimentes el discurso del odio.
El racismo y el sexismo no tienen cabida en Mediavida, así como cualquier tipo de incitación al odio o la violencia contra otros por razón de nacimiento, raza, sexo, religión, opinión o cualquier otra condición o circunstancia personal o social.

- No provoques a otros usuarios.
No contestes en un hilo sobre World of Warcraft diciendo que el WoW apesta. Si lo haces, que sea razonadamente.

- No exponer datos personales de usuarios
NO PONGAS DATOS PERSONALES NI ENLACES A FOTOS PERSONALES O CUENTAS EN REDES SOCIALES DE OTRAS PERSONAS SIN SU CONSENTIMIENTO.

- Nada de publicidad, spam, enlaces con afiliados o acortadores.

- No pidas, enlaces o ayudes a conseguir contenido pirateado o ilegal.

- Usa el comando [spoiler]
si crees que puede arruinar películas, libros o juegos a lectores despistados, el contenido sensible debe de estar encapsulado en el markdown [spoiler].

- Las fotos de desnudos o cosas comprometidas
deben ser ocultadas o enlazadas indicando que son NSFW/NWS.

- No hagas de moderador copiloto.
No respondas a mensajes que has reportado o para decir que algo va contra las normas. Reporta y circula.

- No comentes la moderación en un hilo.
No se permite cuestionar la moderación en un hilo. Si tienes dudas, contacta a través del modmail.
`
function HandleOnChangeMvPremium(checked) {
  checked ? window.localStorage.setItem('MvPremiumCSS', 'true') : window.localStorage.setItem('MvPremiumCSS', 'false')
  location.reload()
}
function HandleOnChangeShowIgnoredUsers(checked) {
  checked ? window.localStorage.setItem('ShowIgnoredUsers', 'true') : window.localStorage.setItem('ShowIgnoredUsers', 'false')
  location.reload()
}

function HandleAddHighlightUser() {
  let highlightUser = document.getElementById('highlightUserInput').value
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
      if (data.trim() === '1') {
        let highlightedUsers = JSON.parse(window.localStorage.getItem('highlightedUser')) || []
        highlightedUsers.push(highlightUser)
        window.localStorage.setItem('highlightedUser', JSON.stringify(highlightedUsers))
        location.reload()
      } else {
        alert('El usuario no existe.')
      }
    })
    .catch(error => {
      console.error('Error al verificar el usuario:', error)
      alert('Ocurrió un error al verificar el usuario.')
    })
}

function HandleAddIgnoredUser() {
  let ignoreUser = document.getElementById('ignoreUserInput').value
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
      if (data.trim() === '1') {
        let ignoredUsers = JSON.parse(window.localStorage.getItem('ignoredUser')) || []
        ignoredUsers.push(ignoreUser)
        window.localStorage.setItem('ignoredUser', JSON.stringify(ignoredUsers))
        location.reload()
      } else {
        alert('El usuario no existe.')
      }
    })
    .catch(error => {
      console.error('Error al verificar el usuario:', error)
      alert('Ocurrió un error al verificar el usuario.')
    })
}

function HandleOnChangeHideBg(checked) {
  checked ? window.localStorage.setItem('MvPremiumCSSWithoutBG', 'true') : window.localStorage.setItem('MvPremiumCSSWithoutBG', 'false')
  location.reload()
}

function handleApiKey(apiKey) {
  window.localStorage.setItem('apiKey', apiKey)
  location.reload()
}

function HandleAddNoteUser() {
  let notedUser = document.getElementById('notedUserInput').value
  let note = document.getElementById('notedTextInput').value
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
      if (data.trim() === '1') {
        let notedUsers = JSON.parse(window.localStorage.getItem('notedUser')) || []
        notedUsers.push({ nickname: notedUser, note: note })
        window.localStorage.setItem('notedUser', JSON.stringify(notedUsers))
        location.reload()
      } else {
        alert('El usuario no existe.')
      }
    })
    .catch(error => {
      console.error('Error al verificar el usuario:', error)
      alert('Ocurrió un error al verificar el usuario.')
    })
}

function HandleOnChangeUltrawide(checked) {
  checked ? window.localStorage.setItem('mvultrawide', 'true') : window.localStorage.setItem('mvultrawide', 'false')
  location.reload()
}

function exportConfig() {
  let config = {
    MvPremiumCSS: window.localStorage.getItem('MvPremiumCSS'),
    ShowIgnoredUsers: window.localStorage.getItem('ShowIgnoredUsers'),
    MvPremiumCSSWithoutBG: window.localStorage.getItem('MvPremiumCSSWithoutBG'),
    showIpsWithoutClons: window.localStorage.getItem('showIpsWithoutClons'),
    mvultrawide: window.localStorage.getItem('mvultrawide'),
    highlightedUser: JSON.parse(window.localStorage.getItem('highlightedUser')),
    ignoredUser: JSON.parse(window.localStorage.getItem('ignoredUser')),
    notedUser: JSON.parse(window.localStorage.getItem('notedUser')),
    apiKey: JSON.parse(window.localStorage.getItem('apiKey'))
  }
  let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config))
  let downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', 'config.json')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

function importConfig() {
  let input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = e => {
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = readerEvent => {
      let content = readerEvent.target.result
      let config = JSON.parse(content)
      window.localStorage.setItem('MvPremiumCSS', config.MvPremiumCSS)
      window.localStorage.setItem('ShowIgnoredUsers', config.ShowIgnoredUsers)
      window.localStorage.setItem('MvPremiumCSSWithoutBG', config.MvPremiumCSSWithoutBG)
      window.localStorage.setItem('showIpsWithoutClons', config.showIpsWithoutClons)
      window.localStorage.setItem('mvultrawide', config.mvultrawide)
      window.localStorage.setItem('highlightedUser', JSON.stringify(config.highlightedUser))
      window.localStorage.setItem('ignoredUser', JSON.stringify(config.ignoredUser))
      window.localStorage.setItem('notedUser', JSON.stringify(config.notedUser))
      window.localStorage.setItem('apiKey', JSON.stringify(config.apiKey))
      location.reload()
    }
  }
  input.click()
}

function analizarComentarioIA(comentario, acción, target) {
  let prompt = ''
  switch (acción) {
    case 'normas':
      prompt =
        "Analiza y dime el numero de normas incumple del siguiente texto '" +
        normas +
        "' el siguiente comentario: " +
        comentario +
        ". Devuelveme el resultado en formato html table con clase 'reporte-ia'. Esta tabla html debe de tener dos columnas. Columna 0: 'Norma' y columna 1: 'Motivo'. "
      break
    case 'resumen':
      prompt = 'resumeme el siguiente texto en un máximo de 2 frases: ' + comentario
      break
    default:
      console.error('Target no reconocido.')
  }

  let attempts = 0
  const maxAttempts = 3

  const fetchData = () => {
    fetch(API_REQUEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    })
      .then(response => response.json())
      .then(data => {
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (responseText) {
          let responseHTML = responseText
          if (responseHTML.includes('```html')) {
            responseHTML = responseHTML.replace(/```html/g, '')
          }
          if (responseHTML.includes('```')) {
            responseHTML = responseHTML.replace(/```/g, '')
          }
          if (responseHTML.includes('|')) {
            const lines = responseHTML.split('\n')
            let tableHTML = "<table class='reporte-ia'><thead><tr>"
            const headers = lines[0].split('|').filter(header => header.trim())
            headers.forEach(header => {
              tableHTML += `<th>${header.trim()}</th>`
            })
            tableHTML += '</tr></thead><tbody>'
            for (let i = 2; i < lines.length; i++) {
              const row = lines[i].split('|').filter(cell => cell.trim())
              if (row.length > 0) {
                tableHTML += '<tr>'
                row.forEach(cell => {
                  tableHTML += `<td>${cell.trim()}</td>`
                })
                tableHTML += '</tr>'
              }
            }
            tableHTML += '</tbody></table>'
            responseHTML = tableHTML
          }
          document.getElementById(target).innerHTML = responseHTML
        } else {
          throw new Error('Invalid API response.')
        }
      })
      .catch(error => {
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(fetchData, 7000)
        } else {
          document.getElementById(target).innerHTML = 'Error al analizar el comentario. Prueba de nuevo.<br>' + error
          console.error('Error al analizar el comentario:', error)
        }
      })
  }

  fetchData()
}

const HandleGetIAreponse = async incomingMessageElement => {
  const idPost = incomingMessageElement.replaceAll('ia-', '')
  const post = document.getElementById(idPost).querySelector('.post-contents').innerText
  document.getElementById('ia-response-' + idPost).innerHTML = 'Loading...'
  document.getElementById('ia-response-' + idPost).style = 'display: block'

  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(API_REQUEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'resumeme el siguiente texto en una frase: ' + post }] }]
        })
      })

      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.error.message)

      const responseText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text
      if (responseText) {
        document.getElementById('ia-response-' + idPost).innerHTML = responseText
        return
      } else {
        throw new Error('Invalid API response.')
      }
    } catch (error) {
      attempts++
      if (attempts >= maxAttempts) {
        document.getElementById('ia-response-' + idPost).innerHTML = 'Error al obtener la respuesta. Prueba de nuevo.<br><br>' + error
        return
      }
    }
  }
}
