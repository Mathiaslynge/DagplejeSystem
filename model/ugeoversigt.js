const mongoose = require('mongoose');


const ugeoversigtSchema = new mongoose.Schema({
    ugenr: Number,
    dage: [{type: mongoose.ObjectId, ref: 'Dag'}]
});

module.exports = mongoose.model('uge', ugeoversigtSchema);