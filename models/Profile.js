const {model, Schema} = require ('mongoose');



const movies = new Schema ({
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true,
        default: 'Drama'
    },
    rating: {
        type: Number,
        required: true
    }
})
const MovieSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    movies: {
        type: [movies],
        required: true
    }
});

module.exports = model ('MovieRating', MovieSchema);

