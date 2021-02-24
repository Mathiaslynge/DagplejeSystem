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

router
    .get('/:filer', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                // if (request.params.filer.charAt(request.params.filer.length-1) == 'l')
                // {
                //     console.log(request.params.filer.charAt(reqeust.params.filer.length-1));
                //     console.log("Jeg er html")
                // }
                let filePath = "../app/private/html/" + request.params.filer
                let resolvedPath = path.resolve(filePath);
                response.sendFile(resolvedPath);
            } else {
                response.redirect('/ingenAdgang.html');
            }
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