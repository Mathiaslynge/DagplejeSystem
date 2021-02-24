const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    contentType: String,
    image: Buffer,
    day: String,
    month: String,
    year: String
});



module.exports = mongoose.model('Image', imageSchema);