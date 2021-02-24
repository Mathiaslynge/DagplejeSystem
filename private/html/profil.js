async function get(url) {
  const respons = await fetch(url);
  if (respons.status !== 200) // OK
    throw new Error(respons.status);
  return await respons.json();
}



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


let gem = document.getElementById("gemProfil")


gem.addEventListener('click', async (event) => {
  if (!event.isTrusted) return
  try {
    event.preventDefault()
    let fornavnText = document.getElementById("fornavn").value
    let efternavnText = document.getElementById("efternavn").value
    let fdatoText = document.getElementById("fdato").value
    let konText = document.getElementById("kon").value
    let parent1Text = document.getElementById("parent1").value
    let parent2Text = document.getElementById("parent2").value
    let usernameText = document.getElementById("username").value
    let passwordText = document.getElementById("password").value
    let aktivfest
    if (aktivfest = document.getElementById("aktiv").checked == true) {
      aktivfest = true
    }
    else {
      aktivfest = false
    }

    //Skrive ind så man kan opdatere
    await post('profil', { fornavn: fornavnText, efternavn: efternavnText, alder: fdatoText, koen: konText, parent1: parent1Text, parent2: parent2Text, username: usernameText, aktiv: aktivfest });
  } catch (err) {
    console.error(err) // or alert it, or put the message on the page
  }
})
async function getBrugersNavn() {
  let length = 0;
  let børn = await get('profil')
  let optionBruger = document.getElementById("vælgprofil")
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

let fornavnText = document.getElementById("fornavn");
let efternavnText = document.getElementById("efternavn");
let fdatoText = document.getElementById("fdato");
let konText = document.getElementById("kon");
let parent1Text = document.getElementById("parent1");
let parent2Text = document.getElementById("parent2");
let usernameText = document.getElementById("username")
let passwordText = document.getElementById("password")

async function getProfilData() {

  let bruger = await get("profil/profilData/")

  console.log(fornavnText);
  fornavnText.value = bruger.fornavn;
  efternavnText.value = bruger.efternavn;
  fdatoText.value = bruger.alder;
  konText.value = bruger.koen;
  parent1Text.value = bruger.parent1;
  parent2Text.value = bruger.parent2;
  usernameText.value = bruger.username;

  if (bruger.aktiv == true) {
    aktiv.checked = true;
  }

  if (bruger.admin == true) {

    let profilInfo = document.getElementById('info')
    let htmlkodeSelect = '<select name="" id="vælgprofil"></select>'
    let htmlkodeLabel1 = '<label for="vælgprofil" id="vælgprofilLBL"> Vælg en profil</label>'
    profilInfo.insertAdjacentHTML('afterend', htmlkodeSelect)
    profilInfo.insertAdjacentHTML('afterend', htmlkodeLabel1)

    getBrugersNavn()
    let optionselect = document.getElementById("vælgprofil");
    optionselect.onchange = () => getBrugerValues();

    let profilen = document.getElementById('password')
    let htmlkodeCheckbox = '<input type="checkbox" id="aktiv"></input>'
    let htmlkodeLabel2 = '<label for="">Aktiv</label>'
    profilen.insertAdjacentHTML('afterend', htmlkodeCheckbox)
    profilen.insertAdjacentHTML('afterend', htmlkodeLabel2)
  }


}
getProfilData()

async function getBrugerValues() {
  let aktiv = document.getElementById("aktiv")
  //Selecte index ugenr fra selecten
  let optionselect = document.getElementById("vælgprofil");
  let brugerValue = optionselect.options[optionselect.selectedIndex].value

  let profil = await get('profil' + '/fornavn/' + brugerValue)

  fornavnText.value = profil.fornavn;
  efternavnText.value = profil.efternavn;
  fdatoText.value = profil.alder;
  konText.value = profil.koen;
  parent1Text.value = profil.parent1;
  parent2Text.value = profil.parent2;
  usernameText.value = profil.username;
  if (profil.aktiv == true) {
    aktiv.checked = true;
  }
  else{
    aktiv.checked = false;
  }
  

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
















