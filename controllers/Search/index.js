const {Router} = require('express');
const BestMatch = require ('string-similarity');
const {auth} = require ('../../middleware');
const Movie = require ('../../models/Movie');


const app = Router();

app.use (auth);

app.post ('/', async (req, res) => {
    const {movie_name} = req.body;


    if (!movie_name) {
        return res.status (400).json ({
            message: 'Please provide a movie name'
        });
    }

    try {
        let movies = [];
        for await (const doc of Movie.find()) {
            // use `doc`
            movies.push (doc.name);
          }

        if (movies.includes (movie_name)) {
            const movie = await Movie.findOne ({name: movie_name});
            const {name, rating, genre} = movie;

            return res.status (200).json ({
                name,
                rating,
                genre,
                message: 'Success'
            });
        } else {
            const bestMatch = BestMatch.findBestMatch (movie_name, movies);
            const movie = await Movie.findOne ({name: bestMatch.bestMatch.target});
            const {name, rating, genre} = movie;

            return res.status (200).json ({
                name,
                rating,
                genre,
                message: 'Success'
            });  
        }


    } catch (err) {
        console.log (err);
        return res.status (500).json ({
            message: 'Internal server error'
    });
}



})











module.exports = app;