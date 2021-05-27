const User = require('../modules/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

// Handle Errors 

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        age: '',
        category: ''
    };

    // Handle the repeated email
    if (err.code === 11000){
        errors.email = 'That email is already used';
        return errors;
    }

    // Validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// Create a Token

const maxAge = 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id } , 'Rent2Play Project', { expiresIn: maxAge });
}


// Register function

const register = (req, res, next) => {
   
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        category: req.body.category,
        isAdmin: req.body.isAdmin
    });
        user.save()
        .then(user =>{
            res.json({
                message: "User added successfully",
                user: user._id
            })
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        }).catch(err => {
            console.log(err);
            const errors = handleErrors(err);
            res.status(401).json({errors}); 
        });  
};

// Login function : The user could login using the email and phone number

const login = (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    

    User.findOne({$or: [{email: username}, {phoneNumber: username}]})
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, function(err, result){
                if (err) {
                    res.json({
                        title: 'Server error',
                        error: err
                    })
                    console.log('err');
                }if (result){
                    const token = createToken(user._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    return res.status(200).json({
                        title: 'Login successfull'
                    })
                    
                }else{
                    return res.status(401).json({
                        title: 'password wrong',
                        error: 'invalid credentials'
                    })
                }
            })
        }
        else {
            return res.status(401).json({
                title: 'password wrong',
                error: 'invalid credentials'
            })   
        }
    })

}

module.exports = {
    register, login
}