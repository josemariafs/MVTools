    function DealToMv() {
        const title = document.querySelector('.text--b.size--all-xl.size--fromW3-xxl').textContent;
        const amount = document.querySelector('.threadItemCard-price.text--b.thread-price').textContent;
        let description = document.querySelector('.userHtml.userHtml-content.overflow--wrap-break.space--mt-3').innerHTML;
        const chart = document.querySelector('.comment-body .userHtml.userHtml-content img')?.src;
        let srcImgDeal = document.querySelector('.flex.flex--dir-col.boxAlign-jc--all-sb.height--all-full img')?.getAttribute('src');

        srcImgDeal = srcImgDeal.replace(/\s|1x|2x/g, '');   
        
        const getDeal = document.querySelector('[data-t="getDeal"]').href;

        let getDealNoRef = '';
        fetch(getDeal, { method: 'HEAD', redirect: 'follow' })
            .then(function(response) {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve(response);
                        console.log(response);

                    }, 6000);
                    setTimeout(function() {

                    console.log(response);
                }, 7500);

                });
            })
            .catch(function(error) {
                console.log(error);
            });

                console.log(getDealNoRef)
        const imgOferta = "https://i.imgur.com/2yNDQ4S.png";

        const category = "otros";
        const turndownService = new TurndownService();
        const editorialText = '<em>Descripción por el <a href="https://www.chollometro.com/faqs#editar" class="link">Equipo Editorial de Chollometro</a></em>';
        description = description.replace(editorialText, '');
        const TDdescription = turndownService.turndown(description);

        let descriptionMD = `# ${title}\n\n [img]${srcImgDeal}[/img] \n\n # Enlace a la oferta  \n\n [url=${getDeal}][img]${imgOferta}[/img][/url] \n\n # Descripción \n\n ${TDdescription}`;

        const chartMD = `\n\n # Historico de precios \n\n [img]${chart}[/img] \n\n # Enlace a la oferta \n\n [url=${getDeal}][img]${imgOferta}[/img][/url] \n\n ### Fuente \n\n Chollometro`;

        const titleEncoded = encodeURIComponent(title+" | "+amount);
        const descriptionMdEncoded = encodeURIComponent(descriptionMD+chartMD);

        window.open("https://www.mediavida.com/foro/club-hucha/nuevo-hilo?title="+titleEncoded+"&description="+descriptionMdEncoded+"&category="+category, "_blank");
    }

    
    if (window.location.href.startsWith("https://www.chollometro.com/ofertas")) {
        const element = document.querySelector('.flex.flex--dir-col.flex--fromW4-dir-row.space--mt-3.space--fromW3-mt-4');
        if (element) {
            // inset button to send deal to mediavida
            const button = document.createElement('button');
            button.innerHTML = `<img style="width:20px" src="${chrome.runtime.getURL(
                "img/mvlogo.png"
              )}"/> <span>Postear oferta en MV</span>`
            button.addEventListener('click', DealToMv);
            button.style = 'background: #323639; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer';
            element.appendChild(button);
        }
        }



    let url = window.location.href
    url = url.split('?')[0];

    if (url.endsWith("club-hucha/nuevo-hilo")) {
        console.log("Club hucha");

        const params = new URLSearchParams(window.location.search);
        const title = params.get('title');
        if (title) {
            document.getElementById('cabecera').value = decodeURIComponent(title);
        }
        let description = params.get('description');
        if (description) {
            document.getElementById('cuerpo').value = description;
        }
        const tagSelect = document.getElementById('tag');
        if (tagSelect) {
            const option = tagSelect.querySelector('option[value="257"]');
            if (option) {
            option.selected = true;
            }
        }
    }