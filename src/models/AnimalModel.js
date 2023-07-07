const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)/;


// TODO add validation
const animalSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'], minlength: [2, 'Name must be at least 2 characters long'] },
    year: { type: Number, required: [true, 'Year is required'], min: 1, max: 100 },
    kind: { type: String, required: true, minlength: [3, 'Kind must be at least 3 characters long'] },
    image: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value);
            },
            message: 'Image must be a valid URL'
        }
    },
    need: { type: String, required: [true, 'Need is required'], minlength: [3, 'Need must be at least 3 characters long'], maxLength: [20, 'Need must be at most 20 characters long'] },
    location: { type: String, required: [true, 'Location required'],  minlength: [5, 'Location must be at least 5 characters long'],  maxLength: [15, 'Location must be at most 15 characters long'] },
    description: { type: String, required: [true, 'Description is required'], minlength: [5, 'Description must be at least 5 characters long'],  maxLength: [50, 'Description must be at most 50 characters long'] },
    donations: { type: [ObjectId], required: true, ref: 'User'},
    owner: { type: ObjectId, ref: 'User', required: true },
    cratedAt: { type: Date, default: Date.now },
});


const AnimalModel = model('Animal', animalSchema);

module.exports = AnimalModel;