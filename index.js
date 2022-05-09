const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



require ('dotenv').config ();



// Import controllers 
const Login = require('./controllers/Auth/login');
const Signup = require('./controllers/Auth/signup');
const ProfileUpdate = require('./controllers/Profile');
const Search = require('./controllers/Search');

const app = express();

app.use (cors());
app.use (express.json());


app.use ('/api/login', Login);
app.use ('/api/signup', Signup);
app.use ('/api/profile', ProfileUpdate);
app.use ('/api/search', Search);



const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URL).then (async () => {
    app.listen (PORT, () => console.log (`Server started on port ${PORT}`));
})
