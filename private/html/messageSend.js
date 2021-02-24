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

  // Clearer textareas
  function clearContents(element) {
    element.value = '';
  }
 

// Putter alle brugere ind i selecten
async function getBrugere() {

    let brugere = await get('beskeder/brugere');
    let selectList = document.getElementById("modtagere");
    for(let i = 0; i < brugere.length; i++){
      let option = document.createElement("option");
      option.value = i+1;
      option.text = brugere[i].username;
      selectList.appendChild(option);
    }
} 
getBrugere();



let sumbitKnap = document.getElementById("submit")

// Sender en besked til den bruger der er valgt i selecten
sumbitKnap.addEventListener('click', async (event) => {
  if (!event.isTrusted) return
  try {
    event.preventDefault()
    let modtagerValue = document.getElementById("modtagere");
    let modtagerUsername = modtagerValue.options[modtagerValue.value].text;

    let beskedValue = document.getElementById("besked").value    

    let beskedSendStatus = await post('beskeder/sendBesked', { modtager: modtagerUsername, besked: beskedValue });

    hentBeskeder();

  } catch (err) {
    console.error(err) 
  }
})


let selectBox = document.getElementById("modtagere");

//Kalder funktionen hentBeskeder hvis der sker en ændring i selecten
selectBox.addEventListener('change', async (event) => {
  if (!event.isTrusted) return
  try {
    event.preventDefault()
    hentBeskeder();
  } catch (err) {
    console.error(err) // or alert it, or put the message on the page
  }
})

// Henter beskederne der matcher med ens eget username og den der er valgt i selecten
// Funktionen opretter også style til chatten.
async function hentBeskeder(){
  try {
    
  const beskederDiven = document.getElementById("beskeder");
  while (beskederDiven.firstChild) {
    beskederDiven.removeChild(beskederDiven.lastChild);
  }
    let modtagerUsername = selectBox.options[selectBox.value].text;
    let beskeder = await post('beskeder/Beskeder', { modtager: modtagerUsername});
    
    let beskedDiv = document.getElementById("beskeder");

    for(let i = 0; i < beskeder.length; i++){
      if(beskeder[i].afsender === modtagerUsername){ 
    
      let nyDiv = document.createElement("div");
      nyDiv.style.padding = "10px";
      nyDiv.style.marginTop = "30px"
      nyDiv.style.marginLeft = "30px"
      nyDiv.style.width ="250px"
      nyDiv.style.border= "1px solid black";
      nyDiv.style.borderRadius= "10px";
      nyDiv.style.boxShadow = "0px 0px 10px 10px rgba(0, 0, 0, 0.5)";
      let nySpan = document.createElement("span");
      let nyBesked = document.createElement("p");
      let navn = document.createElement("h1");
      nyDiv.className = "container";
      nySpan.className = "time-left";
      var nodeBesked = document.createTextNode(beskeder[i].besked);
      var nodeSpan = document.createTextNode(beskeder[i].time);
      var nodeNavn = document.createTextNode(modtagerUsername);
      navn.appendChild(nodeNavn);
      nySpan.appendChild(nodeSpan);
      nyBesked.appendChild(nodeBesked);
      beskedDiv.appendChild(nyDiv);
      nyDiv.appendChild(navn);
      nyDiv.appendChild(nyBesked);
      nyDiv.appendChild(nySpan);
      } else {
        let nyDiv = document.createElement("div");
        nyDiv.style.padding = "10px";
        nyDiv.style.marginTop = "30px"
        nyDiv.style.marginLeft = "30px"
        nyDiv.style.width ="250px"
        nyDiv.style.border= "1px solid black";
        nyDiv.style.borderRadius= "10px";
        nyDiv.style.boxShadow = "0px 0px 10px 10px rgba(0, 0, 0, 0.5)";
        let nySpan = document.createElement("span");
        let nyBesked = document.createElement("p");
        let navn = document.createElement("h1");
        nyDiv.className = "container darker";
        nySpan.className = "time-right";
        navn.className = "right";
        var nodeBesked = document.createTextNode(beskeder[i].besked);
        var nodeSpan = document.createTextNode(beskeder[i].time);
        var nodeNavn = document.createTextNode("Mig");
        navn.appendChild(nodeNavn);
        nySpan.appendChild(nodeSpan);
        nyBesked.appendChild(nodeBesked);
        beskedDiv.appendChild(nyDiv);
        nyDiv.appendChild(navn);
        nyDiv.appendChild(nyBesked);
        nyDiv.appendChild(nySpan);
      }
    }

    var cssId = 'myCss';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '/stylesInbox.css';
    link.media = 'all';
    head.appendChild(link);
}
  } catch (err) {
    console.error(err) // or alert it, or put the message on the page
  }
}

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