const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload'); 
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs')


exports.signup = async (req,res)=>{
    try {
       
        if(!req.files){
            return new Error("Photo is required for signup")
        }

        const {name, email, password} = req.body;

        if(!( email && name && password)){
            return new Error("All fields are required!");
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).send("User already exists");
        }

        const file = req.files.photo;
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "users",
        })


        // register user
        const user = await  User.create({
            name,
            email: email.toLowerCase(),
            password,
            photo: {
                id: result.public_id,
                secure_url: result.secure_url,
            }
        })

        cookieToken(user, res);

    } catch (error) {
        console.log("after cookie Token")
        console.log(error)
        res.status(400).send(error)
    }
} 

exports.login = async (req,res)=>{
    try {
        const {email, password} = req.body;

        // check for email and password field
        if(!(email && password)){
            return res.status.send("All fields are required");
        }

        // check if user is available in DB // get user from DB
        const user = await User.findOne({ email }).select("+password");


        if(!user){
            return res.status(400).send("Email or Password does not match or exist");
        }

        
        // match the password
        const isPasswordCorrect = await user.isPasswordValidated(password);
                                             
        // if password donot match
        if(!isPasswordCorrect){
            return res.status(400).send("Email or Password does not match or exist")
        }

        // if all goes good and we send the token
        cookieToken(user, res);

    } catch (error) {
        console.log(error)
    }
}
