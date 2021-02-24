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

// Opretter beskeden i databasen og sender videre om beskeden er oprettet eller ej vha. true eller false
router
.post('/sendBesked', async (request, response) => {
    try {
        let {modtager, besked} = request.body;
        const username = request.session.username;
        var d = new Date();
        var dateD = d.getDate();
        var dateM = d.getMonth()+1;
        var dateY = d.getFullYear();
        var dateT = d.getUTCHours()+1+":"+(d.getUTCMinutes()<10?'0':'') + d.getUTCMinutes();
        let sendBeskedStatus =  await controller.sendBesked(username, modtager, besked, dateD, dateM, dateY, dateT);
        response.json(sendBeskedStatus);
    } catch (e) {
        sendStatus(e, response);
    }
}
);

// Getter alle brugere fra databasen og sender dem vodere
    router.get('/brugere', async (request, response) => {
        try{
            let brugere = await controller.getBrugere();
            response.send(brugere);
        } catch (e) {
            sendStatus(e, response);
        }
       
      
    });

    // Getter alle beskeder der er sendt og modtaget mellem to brugere og ligger dem sammen i et array og sender dem videre
    router.post('/Beskeder', async (request, response) => {
        try{
            let {modtager} = request.body;
            const username = request.session.username;
            let received = await controller.getMessagesReceived(username, modtager);
            let sent = await controller.getMessagesSent(username, modtager);
            let message = received.concat(sent);
            response.json(message);
        } catch (e) {
            sendStatus(e, response);
        }
    });
    
    

function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}

module.exports = router;