// company.js
const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const path  = require('path');

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

// Laver brugerVerificiering om username og password passer og sender så værdien videre 
router
    .post('/', async (request, response) => {
        try {
            let {username, password} = request.body;
            request.session.username = username;
            let loginstatus = await controller.brugerVerificiering(username, password);
            let bruger = await controller.getBruger(username);
            if (bruger.admin == true)
            {
            request.session.admin = true;
            }
            response.json(loginstatus);
        } catch (e) {
            reponse.sendStatus(500);
            
        }
    }
    // Sender forside.html videre
    )
    .get('/session', async (request, response) => {
        const navn = request.session.username;
        if (navn) {
            let filePath = "../app/private/html/forside.html"
            let resolvedPath = path.resolve(filePath);
            // response.render("forside.html", {navn});
            response.sendFile(resolvedPath);
        } else {
            response.redirect('/ingenAdgang.html');
        }
    })
    // Bruges til log ud knappen. Den fjerner alt der er gemt under session og sender en til index.html
    .get('/Endsession', async (request, response) => {
        const navn = request.session.username;
        if (navn) {
            request.session.destroy();
            response.redirect('/index.html');
        }
    });

function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}

module.exports = router;