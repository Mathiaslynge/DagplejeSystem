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

    //henter alle børn
    .get('/', async (request, response) => {
        try {
            const navn = request.session.username;
            const admin = request.session.admin;
            if (navn) {
                if (admin)
                {
                    let børn = await controller.getBoernene();
                    response.send(børn);
                }
                else
                {
                    let barn = await controller.getBruger(navn);
                    response.send(barn);
                }
                
            }
            else
            {
                //response.redirect('/ingenAdgang.html');
            }
        } catch (e) {
            sendStatus(e, response);
        }
    })
    .get('/fornavn/:fnavn', async (request, response) => {
        try {
           
            const navn = request.session.username;
            if (navn) {
            let bruger = await controller.getBrugerFornavn(request.params.fnavn);
            response.send(bruger);
            }
            else
            {
                //response.redirect('/ingenAdgang.html');
            }
        } catch (e) {
            sendStatus(e, response);
        }
    })

    //Det jeg arbejder med id fra oversigt og bruger
    .get('/fornavn/:oversigt/:bruger', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
            let samletData = await controller.getDageMandagTilFredag(request.params.oversigt, request.params.bruger) 

            response.send(samletData);
            }
            else
            {
                //response.redirect('/ingenAdgang.html');
            }

          
        } catch (e) {
            sendStatus(e, response);
        }
    })
    .get('/profilData', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let bruger = await controller.getBruger(navn);
                response.send(bruger);
            }
            else
            {
                //response.redirect('/ingenAdgang.html');
            }
          
        } catch (e) {
            sendStatus(e, response);
        }
    })
    .get('/profilData/:navn', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let bruger = await controller.getBruger(request.params.navn);
                response.send(bruger);
            }
            else
            {
                //response.redirect('/ingenAdgang.html');
            }
          
        } catch (e) {
            sendStatus(e, response);
        }
    })
    .post('/', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
            let { fornavn, efternavn, alder, koen, parent1, parent2, aktiv, username } = request.body;
            await controller.updateProfil(fornavn, efternavn, alder, koen, parent1, parent2,aktiv, username);

            response.send({ message: 'profil Opdateret!' });
            }
            else
            {
                //response.redirect('/ingenAdgang.html');
            }
           
        } catch (e) {
            sendStatus(e, response);
        }
    }
    );
    

function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}

module.exports = router;