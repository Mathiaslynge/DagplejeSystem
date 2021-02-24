async function post(url, objekt) {
  const respons = await fetch(url, {
    method: "POST",
    body: JSON.stringify(objekt),
    headers: { 'Content-Type': 'application/json' }
  });
  if (respons.status !== 200) // Created
    throw new Error(respons.status);
  return await respons.json();
}

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

let gem = document.getElementById("gem")
let inputs = document.querySelectorAll('input')

gem.addEventListener('click', async (event) => {
  if (!event.isTrusted) return
  try {
    event.preventDefault()
    //Skal opdatere og gemme data fra hver dag


    document.getElementById("okUgeplan").innerHTML = "Ugeplan gemt";
    setTimeout(function () {
      document.getElementById("okUgeplan").innerHTML = "";
    }, 3000);

    //Selecte index navn fra selecten
    let optionselectBruger = document.getElementById("barnSelect");
    let brugerValue = optionselectBruger.options[optionselectBruger.selectedIndex].value

    //Selecte index ugenr fra selecten
    let optionselectUge = document.getElementById("ugeSelect");
    let ugenr = optionselectUge.options[optionselectUge.selectedIndex].value


    //Selecte alle dage fra html classes i ugeoversigt.html
    let dage = document.querySelectorAll('.dag');

    // let inputPrDag = dage.querySelector('input')
    let inputPrdag = [];
    let textareaPrdag = [];


    //Kører loop igennem og henter alle input fra mandag til tirsdag
    for (let i = 0; i < dage.length; i++) {
      inputPrdag.push(dage[i].querySelectorAll('input'))
      textareaPrdag.push(dage[i].querySelectorAll('textarea'))
    }

    // Henter ugeoversigten til den pågældende uge ud fra ugenr
    let ugeoversigt = await get("ugeoversigt/" + ugenr)
    // let bruger = await get("bruger/profil" + dataprofil)
    //Henter bruger objektet ud fra fornavn -- Skal ændres til username
    let brugeren = await get('profil' + '/fornavn/' + brugerValue)


    let dag = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag']


    let sygcheck = false;
    let feriecheck = false;
    console.log(textareaPrdag[1][0].value)
    for (let i = 0; i < inputPrdag.length; i++) {

      await post('ugeoversigt/updates', {
        dag: dag[i],
        afleveres: inputPrdag[i][0].value,
        hentes: inputPrdag[i][1].value,
        sovetFra: inputPrdag[i][2].value,
        sovetTil: inputPrdag[i][3].value,
        syg: (inputPrdag[i][4].checked) ? sygecheck = true : sygecheck = false,
        ferie: (inputPrdag[i][5].checked) ? feriecheck = true : feriecheck = false,
        kommentar: (textareaPrdag[i][0].value),
        ugeoversigt: ugeoversigt._id,
        barnet: brugeren._id
      });
    }

  } catch (err) {
    console.error(err) // or alert it, or put the message on the page
  }
})


let optionselect1 = document.getElementById("barnSelect");
let optionselect2 = document.getElementById("ugeSelect");
optionselect1.onchange = () => getDagevalues();
optionselect2.onchange = () => getDagevalues();

async function getDagevalues() {
  //Selecte index navn fra selecten
  let optionselectBruger = document.getElementById("barnSelect");
  let brugerValue = optionselectBruger.options[optionselectBruger.selectedIndex].value
  //Sætte navn til hvems uge det er
  let navn = document.getElementById("Navn")
  navn.innerHTML = brugerValue

  //Selecte index ugenr fra selecten
  let optionselectUge = document.getElementById("ugeSelect");
  let ugenr = optionselectUge.options[optionselectUge.selectedIndex].value

  //Selecte alle dage fra html classes i ugeoversigt.html
  let dage = document.querySelectorAll('.dag');

  // let inputPrDag = dage.querySelector('input')
  let inputPrdag = [];
  let textareaPrdag = [];


  //Kører loop igennem og henter alle input fra mandag til tirsdag
  for (let i = 0; i < dage.length; i++) {
    inputPrdag.push(dage[i].querySelectorAll('input'))
    textareaPrdag.push(dage[i].querySelectorAll('textarea'))
  }

  // Henter ugeoversigten til den pågældende uge ud fra ugenr
  let ugeoversigt = await get("ugeoversigt/" + ugenr)
  // let bruger = await get("bruger/profil" + dataprofil)
  //Henter bruger objektet ud fra fornavn -- Skal ændres til username
  let brugeren = await get('profil' + '/fornavn/' + brugerValue)
  let dagTilbrugerOgOversigt = await get('profil' + '/fornavn/' + ugeoversigt._id + "/" + brugeren._id);


  let attributter = ['Afleveres', 'Hentes', 'Sovetfra', 'Sovettil', 'Syg', 'Ferie']
  let kommentar = ['Kommentar']

  for (let i = 0; i < inputPrdag.length; i++) {
    for (let j = 0; j < inputPrdag[0].length; j++) {
      inputPrdag[i][j].value = dagTilbrugerOgOversigt[i][attributter[j]]
    }

    if (dagTilbrugerOgOversigt[i]['Syg'] == true ? inputPrdag[i][4].checked = true : inputPrdag[i][4].checked = false) {

    }

    if (dagTilbrugerOgOversigt[i]['Ferie'] == true ? inputPrdag[i][5].checked = true : inputPrdag[i][5].checked = false) {

    }
  }
  for (let i = 0; i < textareaPrdag.length; i++) {
    for (let j = 0; j < textareaPrdag[0].length; j++) {
      textareaPrdag[i][j].value = dagTilbrugerOgOversigt[i][kommentar[j]]
    }
  }
}



let checkboxes = document.querySelectorAll("input[type='checkbox']")
let input = document.querySelectorAll("input[type='time']")

for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('change', event => {
    if (event.target.checked) {
      console.log(event.target.value)
      if (i % 2 == 0) {
        for (let k = i; k < i + 4; k++) {
          input[i + k].readOnly = true
          input[i + k].value = null
        }
      }
      else if (i % 2 != 0) {
        for (let k = i; k < i + 4; k++) {
          input[i + k - 2].readOnly = true
          input[i + k - 2].value = null
        }
      }
    } else {
      if (i % 2 == 0) {
        for (let k = i; k < i + 4; k++) {
          input[i + k].readOnly = false
        }
      }
      else if (i % 2 != 0) {
        for (let k = i; k < i + 4; k++) {
          input[i + k - 2].readOnly = false
        }
      }
    }
  })
}




//Opretter selecten til de børn der er i børnehaven
async function getBrugersNavn() {
  let børn = await get('profil')
  let length = 0;
  let optionBruger = document.getElementById("barnSelect")
  for (let i = 0; i < ('length' in børn ? length = børn.length : length = 1); i++) {
    console.log("jeg er i " + i)
    let option = document.createElement("option")

    console.log(option)
    if (length == 1) {
      option.text = børn.fornavn
      optionBruger.options.add(option)
    }
    else {
      if (børn[i].aktiv == true) {
        option.text = børn[i].fornavn
        optionBruger.options.add(option)
        console.log(børn[i].fornavn)
      }
    }

    
  }
}
getBrugersNavn()

// Opretter alle uger i selecten venstre for navne selecten
async function getUgerne() {
  let uger = await get('ugeoversigt')
  let optionUger = document.getElementById("ugeSelect")
  console.log(uger.length)
  for (let i = 0; i < uger.length; i++) {
    let option = document.createElement("option")
    option.text = uger[i].ugenr
    optionUger.options.add(option)
  }
}
getUgerne()


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