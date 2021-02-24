const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');



router
    // Getter ugeoversigterne fra 1-52
    .get('/', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let ugeoversight = await controller.getUgeoversigter();
                response.send(ugeoversight);
            }
            else {
                //response.redirect('/ingenAdgang.html');
            }
        } catch (e) {
            sendStatus(e, response);
        }
    })
    // Getter en uge med en bestemt ugeoversigt
    .get('/:ugenr', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let ugeoversigt = await controller.getUgeoversigt(request.params.ugenr);
                response.send(ugeoversigt);
            }
            else {
                //response.redirect('/ingenAdgang.html');
            }
        } catch (e) {
            sendStatus(e, response);
        }
    })
    // Opretter 52 uger til fri afbenyttelse - kan laves gennem test
    .post('/opretUger', async (request, response) => {
        try {


            for (let i = 1; i <= 52; i++) {
                const uge = await controller.getUgeoversigt(i)
                if (uge == null)
                {
                const opretuge = await controller.createUgeoversigt(i)
                }
               

            }
            response.send({ message: 'ugerne oprettet!' });
        } catch (e) {
            sendStatus(e, response);
        }
    }
    )
    //Poster uger og dage til en bruger - skal laves så når personen oprettes sker dette post
    .post('/', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let { username } = request.body
                let dage = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag'];
                let bruger = await controller.getBruger(username);


                for (let i = 1; i <= 52; i++) {
                    const uge = await controller.getUgeoversigt(i)
                    for (let j = 0; j <= 4; j++) {
                        const dag = await controller.createDag(dage[j], '', '', '', '', false, false, '', uge, bruger);
                        await controller.connectDagTilUge(dag, uge);
                        await controller.connectDagTilBruger(dag, bruger);
                    }
                }
                response.send({ message: 'ugeoversight saved!' });
            }
            else {
                // response.redirect('/ingenAdgang.html');
            }

        } catch (e) {
            sendStatus(e, response);
        }
    }
    )
    // Opdaterer ugeoversigten med nye values
    .post('/updates', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let { dag, afleveres, hentes, sovetFra, sovetTil, syg, ferie, kommentar, ugeoversigt, barnet } = request.body

                await controller.updateOversigt(dag, afleveres, hentes, sovetFra, sovetTil, syg, ferie, kommentar, ugeoversigt, barnet);

                response.send({ message: 'ugeoversight saved!' });
            }
            else {
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