const mongoose = require('mongoose');

const dagSchema = new mongoose.Schema({
    Navn: String,
    Afleveres: String,
    Hentes: String,
    Sovetfra: String,
    Sovettil: String,
    Syg: Boolean,
    Ferie: Boolean,
    Kommentar: String,
    ugeoversigter: {type: mongoose.ObjectId, ref: 'uge'},
    barn: {type: mongoose.ObjectId, ref: 'Barn'},
});

module.exports = mongoose.model('Dag', dagSchema);

