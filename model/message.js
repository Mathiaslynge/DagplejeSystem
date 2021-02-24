const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    // afsender: {type: mongoose.ObjectId, ref: 'Bruger'},
    afsender: String,
    modtager: String,
    besked: String,
    day: String,
    month: String,
    year: String,
    time: String
});



module.exports = mongoose.model('message', messageSchema);