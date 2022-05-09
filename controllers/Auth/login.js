const Router = require ('express').Router;
const jwt = require ('jsonwebtoken');
const {Compare} = require ('../../utils');
const UserModel = require ('../../models/Users');

const app = Router ();


app.post ('/', async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status (400).json ({
                message: 'Please provide username and password'
            });
        }

        const user = await UserModel.findOne ({username});

        if (!user)
            return res.status (404).json ({message: 'User not found'});

        const isValid = await Compare (password, user.password);

        if (!isValid)
            return res.status (401).json ({message: 'Invalid credentials'});

        
        const token = jwt.sign ({user: username}, process.env.ACCESS_TOKEN)
        res.status (200).json ({
            message: 'Login successful',
            token: token
        });


    } catch (err) {
        console.log (err);
        res.status (500).json ({message: 'Internal server error'});
    }
})











module.exports = app;