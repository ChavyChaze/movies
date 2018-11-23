const mongoose = require('mongoose');

const GenresSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Genres', GenresSchema);
