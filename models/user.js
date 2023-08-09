require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide your name"],
        maxlength: [40, "Name should be under 40 characters"],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Provide an email"],
        validate: [validator.isEmail, 'Please enter email in correct format'],
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Provide an password"],
        minlength: [6, "Password should be atleast 8 character"],
    },
    role:{
        type: String,
        default: 'user'
    },
    photo:{
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        },

    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
}, {timestamps: true})


// encrypt password before save // pre-hook
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
})

// validate the password with passed on user password // compare password
userSchema.methods.isPasswordValidated = async function(userLoginPassword){
    return await bcrypt.compare(userLoginPassword, this.password);
}

// create and return jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

//generate forget password token (string)
userSchema.methods.getForgetPasswordToken = function(){
    //generate a long and random string
    const forgetToken = crypto.randomBytes(20).toString('hex');

    // getting a hash - make sure to get a hash on backend
    this.forgetPasswordToken = crypto.createHash('sha256').update(forgetToken).digest('hex');

    // time of token 
    this.forgetPasswordExpiry = Date.now() + 5 *60 *1000;

    return forgetToken;
}

module.exports = mongoose.model("User", userSchema);