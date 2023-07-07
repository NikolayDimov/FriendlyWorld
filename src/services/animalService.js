const AnimalModel = require('../models/AnimalModel');


async function getAllAnimalForHomePage() {
    return AnimalModel.find({}).sort({ cratedAt: -1 }).limit(3).lean();
}

async function getAllAnimalsForCatalog() {
    return AnimalModel.find({}).lean();
}

async function getDonationAnimalById(animalId) {
    return AnimalModel.findById(animalId).populate('owner').lean();
}

async function makeADonation(animalId, userId) {
    const existing = await AnimalModel.findById(animalId);
    existing.donations.push(userId);
    return existing.save();
}

async function getAnimalByIdRaw(animalId) {
    return AnimalModel.findById(animalId).lean();
}


async function getAnimalById(animalId) {
    return AnimalModel.findById(animalId).populate('owner').lean();
}


async function createAnimal(animalData) {
    const result = new AnimalModel(animalData);
    await result.save();
    return result;
}

async function editAnimal(animalId, currEditedAnimal) {
    const existing = await AnimalModel.findById(animalId);

    existing.name = currEditedAnimal.name;
    existing.year = Number(currEditedAnimal.year);
    existing.kind = currEditedAnimal.kind;
    existing.image = currEditedAnimal.image;
    existing.need = currEditedAnimal.need;
    existing.location = currEditedAnimal.location;
    existing.description = currEditedAnimal.description;

    return existing.save();
}


async function deleteById(animalId) {
    return AnimalModel.findByIdAndDelete(animalId);
}




// Search
async function searchAnimalByLocation (searchTextLocation) {
    if (searchTextLocation) {
        return (AnimalModel.find({ location: { $regex: searchTextLocation, $options: 'i' } }).lean());
    }
}



module.exports = {
    getAllAnimalForHomePage,
    createAnimal,
    getAllAnimalsForCatalog,
    getAnimalByIdRaw,
    getDonationAnimalById,
    makeADonation,
    getAnimalById,
    deleteById,
    editAnimal,
    searchAnimalByLocation
};





// Search func example

// async function search (gameText, gamePlat) {
//     if (gameText) {
//         return (GameModel.find({ name: { $regex: gameText, $options: 'i' } }).lean());
//     }

//     if (!gameText && gamePlat) {
//         return (GameModel.find({ platform: gamePlat }).lean());
//     }
// }