const homeController = require('express').Router();
const { getAllAnimalForHomePage } = require('../services/animalService');



homeController.get('/', async (req, res) => {
    const animalForHome = await getAllAnimalForHomePage();
    //console.log(homeAds);

    res.render('home', { title: 'Home Page', animalForHome: [] });
});

module.exports = homeController;


