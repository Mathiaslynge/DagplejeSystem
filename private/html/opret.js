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

let opret = document.getElementById("opretknap");
let inputs = document.querySelectorAll('input')
let ok = document.getElementById('okBruger')


opret.addEventListener("click", async (event) => {
    if (!event.isTrusted) return
    try {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.removeProperty('border');
            ok.innerHTML = "";
            if (inputs[i].value == "" ) {
                ok.innerHTML = "Venlist indtast i det markeret felt"
                ok.style.color = "red"
                inputs[i].style.borderColor = "red"
                return;
            }
        }
        let fornavnText = document.getElementById("fornavn").value
        let efternavnText = document.getElementById("efternavn").value
        let fdatoText = document.getElementById("fdato").value
        let koenText = document.getElementById("køn").value
        let parent1Text = document.getElementById("parent1").value
        let parent2Text = document.getElementById("parent2").value
        let usernameText = document.getElementById("username").value
        let passwordText = document.getElementById("password").value



        await post('bruger', {
            fornavn: fornavnText,
            efternavn: efternavnText,
            alder: fdatoText,
            koen: koenText,
            parent1: parent1Text,
            parent2: parent2Text,
            username: usernameText,
            password: passwordText,
            aktiv: true,
            admin: false
        })
        //Den her opretter alle dage til personen og linker dem igennem route
        await post('ugeoversigt', { username: usernameText });

        document.getElementById("okBruger").innerHTML="Bruger oprettet";
        setTimeout(function(){
        document.getElementById("okBruger").innerHTML="";
        },3000);



    } catch (err) {
        console.error(err)
    }


    // location.reload();

})
