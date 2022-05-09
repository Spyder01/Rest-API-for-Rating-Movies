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

const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    movies: {
        type: [movies],
    },
})

module.exports = model ('User', UserSchema);