const mongoose = require('mongoose');

const brugerSchema = new mongoose.Schema({
    fornavn: String,
    efternavn: String,
    alder: String,
    koen: String,
    parent1: String,
    parent2: String,
    username: String,
    password: String,
    aktiv: Boolean,
    admin: Boolean,
    dage: [{type: mongoose.ObjectId, ref: 'Dag'}],
});

module.exports = mongoose.model('Bruger', brugerSchema);

