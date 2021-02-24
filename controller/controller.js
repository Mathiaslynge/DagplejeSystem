const mongoose = require('mongoose');
const config = require('../config');
const ugeoversigt = require('../model/ugeoversigt');
const dag = require('../model/dage');
const brugeren = require('../model/bruger');
const infotable = require('../model/infotavle');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const { databaseURI } = require('../config');
const images = require('../model/image');
const message = require('../model/message');


mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });

//Creater ugeoversigt ud fra et ugenr
exports.createUgeoversigt = async function (ugenr) {
    return ugeoversigt.create({
        ugenr,
    })
};
//Creater dag ud fra attributterne på dagen
exports.createDag = async function (Navn, Afleveres, Hentes, Sovetfra, Sovettil, Syg, Ferie, Kommentar) {
    return dag.create({ Navn, Afleveres, Hentes, Sovetfra, Sovettil, Syg, Ferie, Kommentar })
}
//Getter dagen ud fra et ID
exports.getDag = function (id) {
    return dag.findOne().select().where('navn').eq(id).exec();
}

//Getter alle dage
exports.getDage = function () {
    return dag.find().select().exec();
}

//Getter ugeoversigt til oversigten gennem ugenr
exports.getUgeoversigt = function (ugenr) {
    return ugeoversigt.findOne().select('dage ugenr').where('ugenr').eq(ugenr).exec();
};

//Getter ugeoversigter - allesammen
exports.getUgeoversigter = function () {
    return ugeoversigt.find().select('ugenr').exec();
};

//Createbruger ud fra attributterne på bruger
exports.createBruger = async function (fornavn, efternavn, alder, koen, parent1, parent2, username, password, aktiv, admin) {
    const saltRounds = 10;
    hashPw = bcrypt.hashSync(password, saltRounds);
    password = hashPw;
    return brugeren.create({ fornavn, efternavn, alder, koen, parent1, parent2, username, password,aktiv, admin })
}

//Getter bruger ud fra fornavn
exports.getBrugerFornavn = async function (fornavn) {
    return await brugeren.findOne().select().where('fornavn').eq(fornavn).exec();
};

//Getter dagene mandag til fredag ud fra ugeoversigten passer til dagens link og barne linket passer til dagen
exports.getDageMandagTilFredag = async function (ugeoversigte, barn) {
    return await dag.find().select().where('ugeoversigter').eq(ugeoversigte).where('barn').eq(barn).exec();
};

//Getter bruger gennem username
exports.getBruger = async function (username) {
    return await brugeren.findOne().select().where('username').eq(username).exec();
};

//Getter alle børnene
exports.getBoernene = function () {
    return brugeren.find().select().exec();
};

//Deleter brugeren ud fra brugerID
exports.deleteBruger = async function (barnId) {
    return brugeren.deleteOne().where('_id').equals(barnId).exec();
};

//Connecter dag til en bestemt uge ud fra ID - Der bliver brugt findOneAndUpdate funktion frem for save - "overwriter"
exports.connectDagTilUge = async function (dage, ugeoversigter) {
    mongoose.set('useFindAndModify', false);
    await dag.findOneAndUpdate({ _id: dage._id }, { ugeoversigter: ugeoversigter._id })

    await ugeoversigt.findOneAndUpdate({ _id: ugeoversigter._id }, { $push: { dage: dage } })
}

//Connecter dag til en bestemt uge ud fra ID - Der bliver brugt findOneAndUpdate funktion frem for save - "overwriter"
exports.connectDagTilBruger = async function (dage, bruger) {
    mongoose.set('useFindAndModify', false);
    console.log(bruger._id + "JEG ER BRUGEREN DER OOPDATERS " + bruger.username)
    await dag.findOneAndUpdate({ _id: dage._id }, { barn: bruger })
    await brugeren.findOneAndUpdate({ _id: bruger._id }, { $push: { dage: dage } })
}

//Updaterer profilens attributter
exports.updateProfil = async function (fornavn, efternavn, alder, koen, parent1, parent2,aktiv, username) {
    mongoose.set('useFindAndModify', false);
    console.log(username)
    let c1 = await brugeren.findOneAndUpdate({ username: username }, { fornavn: fornavn, efternavn: efternavn, alder: alder, koen: koen, parent1: parent1, parent2: parent2, aktiv:aktiv })
    console.log(c1 + "Der sker noget her")
}

//Updaterer oversgiten med attributter 
exports.updateOversigt = async function (dage, afleveres, hentes, sovetFra, sovetTil, syg, ferie, kommentar, ugeoversigt, barnet) {
    mongoose.set('useFindAndModify', false);
    console.log(await dag.findOneAndUpdate({ $and: [{ Navn: dage }, { ugeoversigter: ugeoversigt }, { barn: barnet }] }, { Afleveres: afleveres, Hentes: hentes, Sovetfra: sovetFra, Sovettil: sovetTil, Syg: syg, Ferie: ferie, Kommentar: kommentar }) + "Her modifies det")
}

//Getbruger uden eksport, da den bruges i en controller metoder i brugerverificering
async function getBruger(brugernavn) {
    return brugeren.findOne().select().where('username').eq(brugernavn).exec();
}

//Brugerverificering, der tjekker om det krypterede password er sammenligneligt med det password der kommer ind fra databasen
exports.brugerVerificiering = async function (brugernavn, pw) {
    let user = await getBruger(brugernavn);
    if (user.username !== null || user.username !== undefined) {
        let pwstatus = bcrypt.compareSync(pw, user.password);
        if (pwstatus === true) {
            return true;
        } else {
            return false;
        }
    }
}

//Getter teksten fra infotavlen
exports.getTekst = async function () {
    return infotable.findOne().select().exec();
}

//Creater infotavle, med teksten der hører til "Den er nok null i starten"
exports.createInfotavle = async function (tekst) {
    return infotable.create({
        title: "nr1",
        tekst,
    })
};

//Updaterer infotavlen med den nye tekst og overwriter den gamle
exports.updateInfotavle = async function (tekst) {
    mongoose.set('useFindAndModify', false);
    console.log(await infotable.findOneAndUpdate({ title:"nr1" }, { tekst: tekst
        
    }))
};

//Creater image til gallery
exports.createImage = async function (contentType, image, day, month, year){
    return images.create({contentType, image, day, month, year})
}

//Getter det image som matcher på id 
exports.getImage = function (id){
    return images.findOne().select().where('_id').eq(id).exec();
}

//Getter image data til alle images
exports.getImageData = function (){
    return images.find({});
}

//Getter alle images
exports.getAllImages = function(){
    return images.find().select('_id').exec();
}

//Getter messages som bliver sendt til personen
exports.getMessagesReceived = async function (username, afsender){
    return await message.find({modtager: username, afsender: afsender}).exec();
}

//Getter message der er sendt   
exports.getMessagesSent = async function (username, afsender){
    return await message.find({modtager: afsender, afsender: username}).exec();

}


//Opretter en besked, fungerer som hjælpe funktion til funktionen SendBesked
async function createMessage(afsender, modtager, besked, day, month, year, time){
    return await message.create({ afsender, modtager, besked, day, month, year, time })
}

//Opretter en besked vha. hjælpe funktionen CreateMessage og returnere true eller false ift. om beskedne er blevet oprettet eller ej.
exports.sendBesked = async function (afsender, modtager, besked, day, month, year, time){
    let opretBesked = await createMessage(afsender, modtager, besked, day, month, year, time);
        if(opretBesked.afsender !== null || opretBesked.afsender !== undefined && opretBesked.modtager !== null || opretBesked.modtager !== undefined 
             && opretBesked.besked !== null || opretBesked.besked !== undefined){
        return true;
    } else {
        return false;
    }
    }

//Getter alle brugeres usernames
    exports.getBrugere = async function () {
        // return brugeren.find({});
        return brugeren.find().select('username').exec();
    };

    
//-- TIL TEST AF STATISTIK --

function getUgeoversigt(ugenr) {
    return ugeoversigt.findOne().select('ugenr').where('ugenr').eq(ugenr).exec();
};

function getDagTilUgeoversigtOgBarn(ugeoversigt, barn){
    // return dag.find().populate('dage').where('ugeoversigter & barn').eq(ugeoversigt, barn).exec()
    return dag.find().populate('dage').where('ugeoversigter').eq(ugeoversigt).where('barn').eq(barn).exec()
}

function getBoernene() {
    return brugeren.find().select('fornavn').exec();
};

exports.antalSygedage = async function (ugeFra, ugeTil, barn) {
    let antaldage = 0;
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await getUgeoversigt(i)
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, barn);
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == true) {
                antaldage++;
            }
        }
    }
    return antaldage
}

exports.ferieoversigtAlleBørn = async function(uge) {
    let ugeoversigt = await getUgeoversigt(uge)
    let count = 0
    let børn = await getBoernene()
    for (let j = 0; j < børn.length; j++) {
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, børn[j]['_id']);
        for (let k = 0; k < dagTilbrugerOgOversigt.length; k++) {
            if (dagTilbrugerOgOversigt[k]['Ferie'] == true) {
                count++
            }
        }
    }
    return count
}

exports.gennemsnitligSøvnPrDag = async function(ugeFra, ugeTil, barn) {
    let timer = []
    let minutter = []
    let res = []
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await getUgeoversigt(i)
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, barn);
        let timerIdagpleje = 0;
        let minIdagpleje = 0;
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == false && dagTilbrugerOgOversigt[j]['Ferie'] == false) {
                let sovetFra = dagTilbrugerOgOversigt[j]['Sovetfra']
                let sovetTil = dagTilbrugerOgOversigt[j]['Sovettil']
                console.log(sovetFra + ' : ' + sovetTil)
                sovetFra = sovetFra.split(':')
                sovetTil = sovetTil.split(':')
                let start = new Date(0, 0, 0, sovetFra[0], sovetFra[1], 0)
                let slut = new Date(0, 0, 0, sovetTil[0], sovetTil[1], 0)
                let diff = slut.getTime() - start.getTime()
                timerIdagpleje = Math.floor(diff / 1000 / 60 / 60)
                timer.push(timerIdagpleje)
                diff -= timerIdagpleje * 1000 * 60 * 60
                minIdagpleje = Math.floor(diff / 1000 / 60)
                minutter.push(minIdagpleje)
            }
        }
    }
    let gennemsnitTimer = 0
    let gennemsnitMin = 0
    for (let i = 0; i < timer.length; i++) {
        gennemsnitTimer += timer[i]
        gennemsnitMin += minutter[i]
    }
    gennemsnitTimer /= timer.length
    gennemsnitMin /= minutter.length
    if (gennemsnitTimer != Math.floor(gennemsnitTimer)) {
        gennemsnitMin = (gennemsnitTimer - Math.floor(gennemsnitTimer)) * 60
        gennemsnitTimer = Math.floor(gennemsnitTimer)
    }
    res.push(gennemsnitTimer)
    res.push(gennemsnitMin)
    return res
}

exports.gennemsnitligUgentligTilstedeværelse = async function(ugeFra, ugeTil, barn) {
    let res = []
    let timer = []
    let minutter = []
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await getUgeoversigt(i)
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, barn);
        let timerIdagpleje = 0;
        let minIdagpleje = 0;
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == false && dagTilbrugerOgOversigt[j]['Ferie'] == false) {
                let afleveres = dagTilbrugerOgOversigt[j]['Afleveres']
                let hentes = dagTilbrugerOgOversigt[j]['Hentes']
                afleveres = afleveres.split(':')
                hentes = hentes.split(':')
                let start = new Date(0, 0, 0, afleveres[0], afleveres[1], 0)
                let slut = new Date(0, 0, 0, hentes[0], hentes[1], 0)
                let diff = slut.getTime() - start.getTime()
                timerIdagpleje = Math.floor(diff / 1000 / 60 / 60)
                timer.push(timerIdagpleje)
                diff -= timerIdagpleje * 1000 * 60 * 60
                minIdagpleje = Math.floor(diff / 1000 / 60)
                minutter.push(minIdagpleje)
            }
        }
    }
    let gennemsnitTimer = 0
    let gennemsnitMin = 0
    for (let i = 0; i < timer.length; i++) {
        gennemsnitTimer += timer[i]
        gennemsnitMin += minutter[i]
    }
    gennemsnitTimer /= ((ugeTil - ugeFra) + 1)
    gennemsnitMin /= ((ugeTil - ugeFra) + 1)
    if (gennemsnitTimer != Math.floor(gennemsnitTimer)) {
        gennemsnitMin = (gennemsnitTimer - Math.floor(gennemsnitTimer)) * 60
        gennemsnitTimer = Math.floor(gennemsnitTimer)
    }
    if(gennemsnitMin > 59){
        gennemsnitTimer += (Math.floor(gennemsnitMin/60))
        gennemsnitMin = ((gennemsnitMin/60)/10)*60
    }
    console.log(gennemsnitTimer)
    res.push(gennemsnitTimer)
    res.push(gennemsnitMin)
    return res
}
