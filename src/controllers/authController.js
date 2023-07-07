const router = require('express').Router();

// const { isUser, isGuest } = require('../middleware/guards');
const { isAuth } = require('../middleware/userSession');
const { register, login } = require('../services/userService');
const mapErrors = require('../util/mapError');




router.get('/register', (req, res) => {
    res.render('register', { title: 'Register Page' });
});

router.post('/register', async (req, res) => {
    try {
        if (req.body.email == '' || req.body.password == '') {
            throw new Error('All fields are required');
        }

        if (req.body.password.trim().length < 3) {
            throw new Error('Password must be at least 4 characters long');
        }

        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }

       
        const token = await register(req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/');     

       
    } catch (err) {
        const errors = mapErrors(err);
        console.log(errors);
        // TODO add error display to actual template from assignment
        res.status(400).render('register', {
            title: 'Register Page',
            data: { email: req.body.email },
            errors
        });
    }
});





router.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});

router.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/'); 

    } catch (err) {
        const errors = mapErrors(err);
        console.log(errors);
        res.status(404).render('login', {
            title: 'Login Page',
            data: { email: req.body.email },
            errors
        });
    }
});


router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});



module.exports = router;