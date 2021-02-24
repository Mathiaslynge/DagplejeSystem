// const bruger = require("../models/bruger");

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

let sumbitKnap = document.getElementById("submit")

// Hvis man klikker på knappen "submit" sendes username og password til databasen og returnerer true eller false an på om username og password matcher
sumbitKnap.addEventListener('click', async (event) => {
  if (!event.isTrusted) return
  try {
    event.preventDefault()
    let usernamevalue = document.getElementById("usernameInput").value
    let passwordvalue = document.getElementById("passwordInput").value
    
    if(usernamevalue == "" || passwordvalue ==""){
      let ok = document.getElementById("oklogin")
      ok.innerHTML = "Venligst indtast både password og username"
      ok.style.color ="red"
      return;
     }
    let loginStatus = await post('loginBruger', { username: usernamevalue, password: passwordvalue })
    window.location.href = "loginBruger/session";


  } catch (err) {
    console.error(err) 
  }
})
