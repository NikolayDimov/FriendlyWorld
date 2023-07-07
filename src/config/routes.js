const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const animalController = require('../controllers/animalController');

module.exports = (app) => {
    app.use(homeController);
    app.use(authController);
    app.use(animalController);

    // 404 page
    app.get('*', (req, res) => {
        res.render('404', { title: 'Page Not Found' });
    });
};





