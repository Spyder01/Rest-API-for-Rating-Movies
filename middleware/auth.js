const jwt = require ('jsonwebtoken');
const Users = require ('../models/Users');


const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) 
        return res.status (401).json ({message: 'Token not provided'});

    const token = authHeader.split (' ')[1];
    
    if (!token)
        return res.status (401).json ({message: 'Token not provided'});
    
    try {
    jwt.verify (token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err)
            return res.status (401).json ({message: 'Invalid token'});
        
        const userObject = Users.findOne ({username: user.user});

        if (!userObject)
            return res.status (401).json ({message: 'Invalid token'});
        
        const {user:username} = user;
        req.user = username;
    })
    next ();
} catch (err) {
    return res.status (500).json ({message: 'Internal server error'});
}
}

module.exports = auth;