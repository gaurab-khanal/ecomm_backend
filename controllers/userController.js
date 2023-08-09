const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload'); 
const cloudinary = require('cloudinary');

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