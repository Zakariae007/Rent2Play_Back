const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');


// create user schema and model 

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "first name is required"]
    },
    lastName: {
        type: String,
        required: [true, "last name is required"]
    },
    phoneNumber: {
        type: String,
        required: [true, "phone number is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [ 8 , "Minimum password length is 8 characters" ]
    },
    age: {
        type: Number,
        required: [true, "Age is required"]
    },
    category: {
        type: String,
        required: [true, "category is required"],
        enum: ['Amateur', 'Pro']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


// Fire a function after the document is saved in DB

UserSchema.post('save', function (doc , next) {
    console.log('new user was created & saved', doc);
    next();
})

// Fire the hash function to hash the password before storing it in the DB
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log('This is the salt' , salt);
    next();
})


const User = mongoose.model('User', UserSchema);

module.exports = User;
