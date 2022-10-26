const mongoose = require('mongoose');

var Poster = mongoose.model('Poster', {
    id: Number,
    trailerURL: String,
    review: String
});

module.exports = { Poster };