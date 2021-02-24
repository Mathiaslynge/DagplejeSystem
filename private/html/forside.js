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

let oversigt = document.getElementById("oversigt");


async function getTekstData() {
  let tekst = await get("../infotavle")
  console.log(tekst + "Jeg er teksten")
  if (tekst.tekst == null) {
    tekst = await post('../infotavle', { tekst: " " })
  }
  oversigt.value = tekst.tekst
}
getTekstData();

let gemknap = document.getElementById("gemtekst");

let rediger = document.getElementById("rediger");
oversigt = document.getElementById("oversigt");

rediger.addEventListener("click", async (event) => {
  if (!event.isTrusted) return
  try {
    oversigt.removeAttribute('readonly')
    let gemknap = document.getElementById("gemtekst").style.display = "inline"
    rediger.disabled = true;
  } catch (err) {
    console.error(err)
  }
})


oversigt = document.getElementById("oversigt");

gemknap.addEventListener("click", async (event) => {
  if (!event.isTrusted) return
  try {
    rediger.disabled = false;
    oversigt.readOnly = "true"
    let tekst = oversigt.value;
    document.getElementById("tavlegemt").innerHTML = "Tavle gemt";
    setTimeout(function () {
      document.getElementById("tavlegemt").innerHTML = "";
    }, 3000);
    await post('../infotavle/update', {
      tekst: tekst
    })


  } catch (err) {
    console.error(err)
  }

})


// Opretter opret bruger knappen, hvis personen er admin
async function opretKnappenVis() {
  let bruger = await get('../profil/profilData')
  if (bruger.admin == true)
  {
    let tabProfil = document.getElementById('liProfil')
    let htmlkodeTabOpret = '<li><a href="../opret.html" id="Opret"><i class="far fa-address-card"></i> Opret bruger</a></li>'
    tabProfil.insertAdjacentHTML('afterend', htmlkodeTabOpret)
  }
}
opretKnappenVis();