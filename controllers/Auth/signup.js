const Router = require ('express').Router;
const UserModel = require ('../../models/Users');
const {Hash} = require ('../../utils');

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
    if (user) 
        return res.status (409).json ({message: 'User already exists'});

    const hashedPassword = await Hash (password);

    const newUser = new UserModel ({
        username,
        password: hashedPassword
    });

    await newUser.save ();

    res.status (201).json ({message: 'User created successfully'});
    
    
    } catch (err) {
        console.log (err);
        res.status (500).json ({message: 'Internal server error'});
    }
    
})













module.exports = app;