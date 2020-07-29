const {Schema, model} = require('mongoose');

const PhotoSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
    public_id: String
});

module.exports = model('Photo', PhotoSchema);