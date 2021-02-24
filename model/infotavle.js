const mongoose = require('mongoose');


const infotavleSchema = new mongoose.Schema({
    title: String,
    tekst: String
});

module.exports = mongoose.model('infotavle', infotavleSchema);