const {model, Schema} = require ('mongoose');

const movie = model (
    'Movie',
    new Schema ({
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number
        },
        genre: {
            type: String,
            default: 'Drama'
        }
    })
);

module.exports = movie;