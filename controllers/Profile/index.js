const { Router } = require('express');
const { auth } = require('../../middleware');
const User = require('../../models/Users');
const Movies = require('../../models/Movie');



const app = Router();


app.use(auth);

app.get('/', async (req, res) => {
    const username = req.user;
    const user = await User.findOne({ username });
    try {
        if (!user)
            return res.status(401).json({ message: 'Invalid token' });

        const { movies, name, age } = user;

        res.status(200).json({
            movies,
            name,
            age,
            username,
            message: 'Success'
        });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/', async (req, res) => {
    const {
        name,
        age,
        movies
    } = req.body;

    if (!name || !age || !movies) {
        return res.status(400).json({
            message: 'Please provide name, age and movies'
        })
    }

    const regex = /^[a-zA-Z]+$/;

    if (!regex.test(name)) {
        return res.status(400).json({
            message: 'Please provide a valid name'
        })
    }

    if (typeof age !== 'number')
        return res.status(400).json({
            message: 'Age must be a number'
        })

    if (!Array.isArray(movies)) {
        return res.status(400).json({
            message: 'Please provide movies'
        })
    }



    const username = req.user;


    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(404).json({
                message: 'User not found'
            });

            const MovieRes = await checkMovies(res, movies);

            if (MovieRes !== true) {
                 return;
            }

        await user.updateOne({ $set: { age, movies, name } });

        return res.status(200).json({
            message: 'Profile Updated Succesfully'
        });





    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

app.put('/movies', async (req, res) => {
    const username = req.user;
    const {
        movies
    } = req.body;

    if (!movies) {
        return res.status(400).json({
            message: 'Please provide movies'
        });
    }

    if (!Array.isArray(movies)) {
        return res.status(400).json({
            message: 'Please provide movies'
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(404).json({
                message: 'Invalid token'
            });

           const MovieRes = await checkMovies(res, movies);

           if (MovieRes !== true) {
                return;
           }

           const { movies: Movies } = user;
           const newMovies = [...Movies, ...movies];
           await user.updateOne({ $set: { movies: newMovies } });
        } catch (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

            
});

module.exports = app;


const checkMovies = async (res, movies) => {
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const { name, rating, genre } = movie;
        if (!name || !rating) {
            return res.status(400).json({
                message: 'Please provide name, rating and genre'
            });
        }

        if (typeof rating !== 'number') {
            return res.status(400).json({
                message: 'Rating must be a number',
            });
        }

        if (rating < 0 || rating > 10) {
            return res.status(400).json({
                message: 'Rating must be between 0 and 10',
            });
        }

        const movieExists = await Movies.findOne({ name });
        if (!movieExists) {
            const newMovie = new Movies({ name, rating, genre });
            await newMovie.save();
        }
        else if (!movieExists.rating) {
            await Movies.updateOne({ name }, { rating, genre });
        }
        else {
            const { rating: Rating } = movieExists;
            await Movies.updateOne({ name }, { $set: { rating: (Rating + rating) / 2.0, genre } });
        }
    }

    return true;
}