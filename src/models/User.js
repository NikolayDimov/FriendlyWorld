const { Schema, model, Types: { ObjectId } } = require('mongoose');

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/; 


const userSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        validate: {
            validator(value) {
                return EMAIL_PATTERN.test(value);
            },
        message: 'Email must be valid'}, 
        minlength: [10, 'Email must be at least 10 characters long'] },
    hashedPassword: { type: String, required: true },
});

// Index
userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;