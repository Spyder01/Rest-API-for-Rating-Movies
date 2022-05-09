const bcrypt = require ('bcrypt');


const Hash = async (password) => {
    try {
        const salt = await bcrypt.genSalt (10);
        const hashedPassword = await bcrypt.hash (password, salt);
        return hashedPassword;
    } catch (err) {
        console.log ("Hashing error: ", err);
        throw err;
    }
}

const Compare = async (password, hashedPassword) => {
    try {
        const isValid = await bcrypt.compare (password, hashedPassword);
        return isValid;
    } catch (err) {
        console.log ("Compare error: ", err);
        throw err;
    }
}

module.exports = {Hash, Compare};