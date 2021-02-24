// company.js
const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

router
    //get barn ud fra et bestemt navn -- skal nok laves om til username
    .get('/:navn', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let bruger = await controller.getBruger(request.params.navn);
                response.send(bruger);
            }
            else {
                // response.redirect('/ingenAdgang.html');
            }

        } catch (e) {
            sendStatus(e, response);
        }
    })
    //Opretter brugeren
    .post('/', async (request, response) => {
        try {
            //Hvis man laver en bruger i testen, skal det rykkes udenfor navn if sætningen da det vedrører man har logget ind
            const navn = request.session.username;
            if (navn) {
                let { fornavn, efternavn, alder, koen, parent1, parent2, username, password, aktiv, admin } = request.body;
                await controller.createBruger(fornavn, efternavn, alder, koen, parent1, parent2, username, password, aktiv, admin);
                response.send({ message: 'Bruger oprettet!' });
            }
            else {
                // response.redirect('/ingenAdgang.html');
            }
        }
        catch (e) {
            sendStatus(e, response);
        }
    })

    //Opretter brugeren fra test
    .post('/testBruger', async (request, response) => {
        try {

            let { fornavn, efternavn, alder, koen, parent1, parent2, username, password,aktiv, admin } = request.body;
            await controller.createBruger(fornavn, efternavn, alder, koen, parent1, parent2, username, password,aktiv, admin);
            response.send({ message: 'Bruger oprettet!' });


        }
        catch (e) {
            sendStatus(e, response);
        }
    })


function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}

module.exports = router;