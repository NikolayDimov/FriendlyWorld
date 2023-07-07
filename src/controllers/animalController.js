const router = require('express').Router();


const { isAuth } = require('../middleware/userSession');
const { createAnimal, getAllAnimalsForCatalog, getAnimalByIdRaw, getDonationAnimalById, makeADonation, getAnimalById, deleteById, editAnimal, searchAnimalByLocation } = require('../services/animalService');
const mapErrors = require('../util/mapError');



router.get('/create', isAuth, (req, res) => {
    res.render('create', { title: 'Add Animal', data: {} });
});

router.post('/create', isAuth, async (req, res) => {
    const animalData = {
        name: req.body.name,
        year: Number(req.body.year),
        kind: req.body.kind,
        image: req.body.image,
        need: req.body.need,
        location: req.body.location,
        description: req.body.description,
        owner: req.user._id,
    };

    try {
        await createAnimal(animalData);
        res.redirect('/catalog');

    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        return res.status(400).render('create', { title: 'Add Animal', data: animalData, errors });
    }
});



router.get('/catalog', async (req, res) => {
    const animals = await getAllAnimalsForCatalog();
    // console.log(pets);
    res.render('catalog', { title: 'Catalog Houses', animals });
});



router.get('/catalog/:id/details', async (req, res) => {
    try{
        const currAnimal = await getAnimalByIdRaw(req.params.id);
        // console.log(currAnimal);
        const isOwner = currAnimal.owner._id == req.user?._id;
        const hasAlreadyDonate = currAnimal.donations.some(id => id == req.user?._id);
    
        res.render('details', { title: 'Animal Details', currAnimal, isOwner, hasAlreadyDonate });
    } catch(err){
        console.error(err);
        const errors = mapErrors(err);
        return res.redirect('/login');
    }
    
});



router.get('/catalog/:id/donate', async (req, res) => {
    const donationForAnimal = await getDonationAnimalById(req.params.id);
    // console.log(rentHouse);

    if(donationForAnimal.owner._id != req.user._id && donationForAnimal.donations.includes(req.user._id) == false) {
        await makeADonation(req.params.id, req.user._id);
    }

    res.redirect(`/catalog/${req.params.id}/details`);
});





router.get('/catalog/:id/edit', isAuth, async (req, res) => {
    try {
        const currAnimal = await getAnimalById(req.params.id);
        if (currAnimal.owner._id != req.user._id) {
            throw new Error('Cannot edit Animal that you are not owner');
        }

        res.render('edit', { title: 'Edit Animal Info', currAnimal });

    } catch (err) {
        console.log(err.message);
        res.redirect(`/catalog/${req.params.id}/details`);
    }
});


router.post('/catalog/:id/edit', isAuth, async (req, res) => {
    const currAnimalOwner = await getAnimalById(req.params.id);
    
    if (currAnimalOwner.owner._id != req.user._id) {
        throw new Error('Cannot edit Animal that you are not owner');
    }

    const animalId = req.params.id;
   
    const currAnimal = {
        name: req.body.name,
        year: Number(req.body.year),
        kind: req.body.kind,
        image: req.body.image,
        need: req.body.need,
        location: req.body.location,
        description: req.body.description
    };
    
    try {
        await editAnimal(animalId, currAnimal);
        res.redirect(`/catalog/${req.params.id}/details`);

    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('edit', { title: 'Edit Animal Info', currAnimal, errors });
    }
});



router.get('/catalog/:id/delete', isAuth, async (req, res) => {
    const currAnimal = await getAnimalById(req.params.id);
    try {
        if (currAnimal.owner._id != req.user._id) {
            throw new Error('Cannot delete Animal that you are not owner');
        }

        await deleteById(req.params.id);
        res.redirect('/catalog');
    } catch (err) {
        console.log(err.message);
        res.redirect(`/catalog/${req.params.id}/details`);
    }
});



// Option 1
// router.get('/search', async (req, res) => {
//     let searchTextLocation = req.query.search;

//     let searchedAnimal = await searchAnimalByLocation(searchTextLocation);

//     console.log(searchedAnimal);

//     res.render('search_option1', { searchedAnimal })
// });




// Option 2
router.get('/search', async (req, res) => {
    
    try {
        const lastFilteredResult = await getAllAnimalsForCatalog();
        // console.log(lastFilteredResult);
        res.render('search', { title: 'Search', lastFilteredResult });
        
    } catch (err) {
        console.error(err);
        res.redirect('/search');
    }
});

router.post('/search', async (req, res) => {
    try {
        // const searchTextLocation = req.body;
        //console.log(searchTextLocation); -->> India

        // const searchedResult = searchTextLocation['search'];
        // console.log(searchedResult);  -->> India

        // or direct
        const searchTextLocation = req.body.search;

        const lastFilteredResult = await searchAnimalByLocation(searchTextLocation);
        // const lastFilteredResult = filteredHouses.filter(x => x.type.toLowerCase() == searchTextLocation.toLowerCase());
        //console.log(lastFilteredResult);
       


        res.render('search', { title: 'Search', lastFilteredResult });  
    } catch (err) {
        console.error(err);
        res.redirect('/search');
    }
});






module.exports = router;


