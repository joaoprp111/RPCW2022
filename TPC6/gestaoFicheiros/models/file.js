var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
    date: String,
    name: String,
    description: String,
    mimetype: String,
    size: Number
});

module.exports = mongoose.model('file', fileSchema)