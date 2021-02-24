async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function getText(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.text();
}
// indsætter ugerne i fra select
async function getUgerneFra() {
    let uger = await get('ugeoversigt')
    let optionUger = document.getElementById("ugefraSelect")
    for (let i = 0; i < uger.length; i++) {
        let option = document.createElement("option")
        option.text = uger[i].ugenr
        optionUger.options.add(option)
    }
}
// indsætter ugerne i til select
async function getUgerneTil() {
    let uger = await get('ugeoversigt')
    let optionUger = document.getElementById("ugeTilSelect")
    for (let i = 0; i < uger.length; i++) {
        let option = document.createElement("option")
        option.text = uger[i].ugenr
        optionUger.options.add(option)
    }
}
getUgerneFra()
getUgerneTil()
// indsætter børnene i select
async function getBrugersNavn() {
    let length = 0;
    let børn = await get('profil')
    let optionBruger = document.getElementById("barnStatistikSelect")
    for (let i = 0; i < ('length' in børn ? length = børn.length : length = 1); i++) {
        let option = document.createElement("option")
        if (length == 1) {
            option.text = børn.fornavn
        }
        else {
            option.text = børn[i].fornavn
        }
        optionBruger.options.add(option)
    }
}
getBrugersNavn()

let statistikker = document.getElementById('statistik').style.display = "none"
let feriestat = document.getElementById('feriestat').style.display = "none"
let vis = document.getElementById("visStatistik");
let resultat = document.getElementById("sygedage");
//Selecte index ugetilnr fra selecten
let optionselectTilUge = document.getElementById("ugeTilSelect");
//Selecte index navn fra selecten
let optionselectBruger = document.getElementById("barnStatistikSelect");
//Selecte index statistiktype fra selecten
let optionselectStatistik = document.getElementById("statistikselect");
let StatistikValue = optionselectStatistik.options[optionselectStatistik.selectedIndex].value

optionselectStatistik.addEventListener('change', event => {
    if (event.target.value === '2') {
        optionselectBruger.disabled = true
        optionselectTilUge.disabled = true
    }
    if (event.target.value != '2') {
        optionselectBruger.disabled = false
        optionselectTilUge.disabled = false
    }
})

vis.addEventListener('click', async (event) => {
    if (!event.isTrusted) return
    try {
        event.preventDefault()
        //Selecte index ugefranr fra selecten
        let optionselectFraUge = document.getElementById("ugefraSelect");
        let ugefranr = optionselectFraUge.options[optionselectFraUge.selectedIndex].value
        //Selecte index ugetilnr fra selecten
        let optionselectTilUge = document.getElementById("ugeTilSelect");
        let ugetilnr = optionselectTilUge.options[optionselectTilUge.selectedIndex].value
        //Selecte index navn fra selecten
        let optionselectBruger = document.getElementById("barnStatistikSelect");
        let brugerValue = optionselectBruger.options[optionselectBruger.selectedIndex].value
        //Selecte index statistiktype fra selecten
        let optionselectStatistik = document.getElementById("statistikselect");
        let StatistikValue = optionselectStatistik.options[optionselectStatistik.selectedIndex].value

        let brugeren = await get('profil' + '/fornavn/' + brugerValue)
        if (StatistikValue === "1") {
            let statistikker = document.getElementById('statistik').style.display = "block"
            let feriestat = document.getElementById('feriestat').style.display = "none"
            let antaldage = await antalSygedage(ugefranr, ugetilnr, brugeren._id)
            resultat.innerHTML = brugeren.username + " har været syg: " + antaldage + " dage " + "fra uge: " + ugefranr + " til uge: " + ugetilnr
        }
        else if (StatistikValue === "2") {
            let statistikker = document.getElementById('statistik').style.display = "none"
            let feriestat = document.getElementById('feriestat').style.display = "block"
            await ferieoversigtAlleBørn(ugefranr)
        }
        else if (StatistikValue === "3") {
            let statistikker = document.getElementById('statistik').style.display = "block"
            let feriestat = document.getElementById('feriestat').style.display = "none"
            let gennemsnit = await gennemsnitligSøvnPrDag(ugefranr, ugetilnr, brugeren._id)
            resultat.innerHTML = brugeren.username + " har gennemsnitligt sovet " + gennemsnit[0] + " timer og " + Math.round(gennemsnit[1]) + ' minutter om dagen, fra uge: ' + ugefranr + " til uge: " + ugetilnr
        }
        else if (StatistikValue === "4") {
            let statistikker = document.getElementById('statistik').style.display = "block"
            let feriestat = document.getElementById('feriestat').style.display = "none"
            let gennemsnit = await gennemsnitligUgentligTilstedeværelse(ugefranr, ugetilnr, brugeren._id)
            resultat.innerHTML = brugeren.username + " har gennemsnitligt været i dagplejen i " + gennemsnit[0] + " timer og " + Math.round(gennemsnit[1]) + ' minutter om ugen, fra uge: ' + ugefranr + " til uge: " + ugetilnr
        }
    } catch (err) {
        console.error(err) // or alert it, or put the message on the page
    }
})

async function antalSygedage(ugeFra, ugeTil, barn) {
    let antaldage = 0;
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await get("ugeoversigt/" + i)
        let dagTilbrugerOgOversigt = await get('profil' + '/fornavn/' + ugeoversigt._id + "/" + barn);
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == true) {
                antaldage++;
            }
        }
    }
    return antaldage
}

async function ferieoversigtAlleBørn(uge) {
    let mandag = document.getElementById('mandagstat')
    let tirsdag = document.getElementById('tirsdagstat')
    let onsdag = document.getElementById('onsdagstat')
    let torsdag = document.getElementById('torsdagstat')
    let fredag = document.getElementById('fredagstat')
    let ugenrstat = document.getElementById('ugenrstat').innerHTML = 'Uge: ' + uge
    let ugeoversigt = await get("ugeoversigt/" + uge)
    let count = 0
    let børn = await get('profil')
    for (let j = 0; j < børn.length; j++) {
        let dagTilbrugerOgOversigt = await get('profil' + '/fornavn/' + ugeoversigt._id + "/" + børn[j]['_id']);
        for (let k = 0; k < dagTilbrugerOgOversigt.length; k++) {
            if (dagTilbrugerOgOversigt[k]['Ferie'] == true) {
                count++
                if (dagTilbrugerOgOversigt[k]['Navn'] == 'Mandag') {
                    mandag.innerHTML += børn[j]['fornavn'] + "<br />"
                }
                if (dagTilbrugerOgOversigt[k]['Navn'] == 'Tirsdag') {
                    tirsdag.innerHTML += børn[j]['fornavn'] + "<br />"
                }
                if (dagTilbrugerOgOversigt[k]['Navn'] == 'Onsdag') {
                    onsdag.innerHTML += børn[j]['fornavn'] + "<br />"
                }
                if (dagTilbrugerOgOversigt[k]['Navn'] == 'Torsdag') {
                    torsdag.innerHTML += børn[j]['fornavn'] + "<br />"
                }
                if (dagTilbrugerOgOversigt[k]['Navn'] == 'Fredag') {
                    fredag.innerHTML += børn[j]['fornavn'] + "<br />"
                }
            }
        }
    }
    return count
}

async function gennemsnitligSøvnPrDag(ugeFra, ugeTil, barn) {
    let timer = []
    let minutter = []
    let res = []
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await get("ugeoversigt/" + i)
        let dagTilbrugerOgOversigt = await get('profil' + '/fornavn/' + ugeoversigt._id + "/" + barn);
        let timerIdagpleje = 0;
        let minIdagpleje = 0;
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == false && dagTilbrugerOgOversigt[j]['Ferie'] == false) {
                let sovetFra = dagTilbrugerOgOversigt[j]['Sovetfra']
                let sovetTil = dagTilbrugerOgOversigt[j]['Sovettil']
                sovetFra = sovetFra.split(':')
                sovetTil = sovetTil.split(':')
                let start = new Date(0, 0, 0, sovetFra[0], sovetFra[1], 0)
                let slut = new Date(0, 0, 0, sovetTil[0], sovetTil[1], 0)
                let diff = slut.getTime() - start.getTime()
                timerIdagpleje = Math.floor(diff / 1000 / 60 / 60)
                timer.push(timerIdagpleje)
                diff -= timerIdagpleje * 1000 * 60 * 60
                minIdagpleje = Math.floor(diff / 1000 / 60)
                minutter.push(minIdagpleje)
            }
        }
    }
    let gennemsnitTimer = 0
    let gennemsnitMin = 0
    for (let i = 0; i < timer.length; i++) {
        gennemsnitTimer += timer[i]
        gennemsnitMin += minutter[i]
    }
    gennemsnitTimer /= timer.length
    gennemsnitMin /= minutter.length
    if (gennemsnitTimer != Math.floor(gennemsnitTimer)) {
        gennemsnitMin = (gennemsnitTimer - Math.floor(gennemsnitTimer)) * 60
        gennemsnitTimer = Math.floor(gennemsnitTimer)
    }
    res.push(gennemsnitTimer)
    res.push(gennemsnitMin)
    return res
}

async function gennemsnitligUgentligTilstedeværelse(ugeFra, ugeTil, barn) {
    let res = []
    let timer = []
    let minutter = []
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await get("ugeoversigt/" + i)
        let dagTilbrugerOgOversigt = await get('profil' + '/fornavn/' + ugeoversigt._id + "/" + barn);
        let timerIdagpleje = 0;
        let minIdagpleje = 0;
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == false && dagTilbrugerOgOversigt[j]['Ferie'] == false) {
                let afleveres = dagTilbrugerOgOversigt[j]['Afleveres']
                let hentes = dagTilbrugerOgOversigt[j]['Hentes']
                afleveres = afleveres.split(':')
                hentes = hentes.split(':')
                let start = new Date(0, 0, 0, afleveres[0], afleveres[1], 0)
                let slut = new Date(0, 0, 0, hentes[0], hentes[1], 0)
                let diff = slut.getTime() - start.getTime()
                timerIdagpleje = Math.floor(diff / 1000 / 60 / 60)
                timer.push(timerIdagpleje)
                diff -= timerIdagpleje * 1000 * 60 * 60
                minIdagpleje = Math.floor(diff / 1000 / 60)
                minutter.push(minIdagpleje)
            }
        }
    }
    let gennemsnitTimer = 0
    let gennemsnitMin = 0
    for (let i = 0; i < timer.length; i++) {
        gennemsnitTimer += timer[i]
        gennemsnitMin += minutter[i]
    }
    gennemsnitTimer /= ((ugeTil - ugeFra) + 1)
    gennemsnitMin /= ((ugeTil - ugeFra) + 1)
    if (gennemsnitTimer != Math.floor(gennemsnitTimer)) {
        gennemsnitMin = (gennemsnitTimer - Math.floor(gennemsnitTimer)) * 60
        gennemsnitTimer = Math.floor(gennemsnitTimer)
    }
    if(gennemsnitMin > 59){
        gennemsnitTimer += (Math.floor(gennemsnitMin/60))
        gennemsnitMin = ((gennemsnitMin/60)/10)*60
    }
    res.push(gennemsnitTimer)
    res.push(gennemsnitMin)
    return res
}

// Opretter opret bruger knappen, hvis personen er admin
async function opretKnappenVis() {
    let bruger = await get('profil/profilData')
    if (bruger.admin == true)
    {
      let tabProfil = document.getElementById('liProfil')
      let htmlkodeTabOpret = '<li><a href="../opret.html" id="Opret"><i class="far fa-address-card"></i> Opret bruger</a></li>'
      tabProfil.insertAdjacentHTML('afterend', htmlkodeTabOpret)
    }
  }
  opretKnappenVis();