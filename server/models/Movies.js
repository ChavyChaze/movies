const mongoose = require('mongoose');

const MoviesSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    year: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    genre: {
        type: String,
        default: ''
    },
    img: {
        data: Buffer,
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Movies', MoviesSchema);
