const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const JWT_SECRET = 'jwt-secret123';


async function register(email, password) {
    const existing = await getUserByEmail(email);
    if (existing) {
        throw new Error('User is already existing')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        hashedPassword
    });

    await user.save();

    const token = createSession(user);
    return token;
}


async function login(email, password) {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect email or password');
    }

    const token = createSession(user);
    return token;
}

// TODO identify user by given identifier 
// validate if username is taken
async function getUserByUsername(username) {
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    return user;
}

// validate if email is taken
async function getUserByEmail(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    return user;
}



function createSession(user) {
    const payload = {
        _id: user._id,
        email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '2d'});
    return token;
}


function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}



module.exports = {
    register,
    login,
    verifyToken
}