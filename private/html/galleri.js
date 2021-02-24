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


// Denne funktion tilføjer alle billeder til siden som er uploaded på den valgte dato i datepickeren
async function uploadImages(){

  const uploadedpicsNode = document.getElementById("uploadedpics");
  while (uploadedpicsNode.firstChild) {
    uploadedpicsNode.removeChild(uploadedpicsNode.lastChild);
  }

let dp = document.getElementById("datepicker");
let res = dp.value.split("-");

let images = await get('galleri/images');
let images2 = await get('galleri/');

      for(let i = 0; i < images.length; i++){
        if(res[0] === images2[i].year && res[1] === images2[i].month && res[2] === images2[i].day ){
          let imagePath = 'galleri/'+images[i]._id;
          let t = document.createElement("a")
          let x = document.createElement("IMG")
          t.setAttribute("href", imagePath);
          x.setAttribute("src", imagePath);
          t.setAttribute("data-lightbox","galleri");
          x.setAttribute("width", "250");
          x.setAttribute("height", "250");
          x.id = "image"+i;
          t.appendChild(x)
         
          document.getElementById("uploadedpics").appendChild(t);
        }
      }
}

let dp = document.getElementById("datepicker");
dp.addEventListener('change', async (event) => {
  if (!event.isTrusted) return
  try {
    event.preventDefault()
   
    uploadImages();

  } catch (err) {
    console.error(err) 
  }
})


uploadImages();

//Viser knappen opret hvis man er Admin
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