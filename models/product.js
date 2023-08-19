const mongoose = require('mongoose');

const productSchema  = new mongoose.Schema({
    name:{
        type: String,
        require: [true, "Please provide product name"],
        trim: true,
        maxlength: [120,"Procuct name should not be more than 120 characters"]
    },
    price:{
        type: Number,
        require: [true, "Please provide product price"],
        maxlength: [6,"Procuct price should not be more than 6 digits "]
    },
    description:{
        type: String,
        require: [true, "Please provide product description"],
        trim: true,
    },
    photos:[
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        },

    ],
    category: {
        type: String,
        required: [true, "Please select category from- short-sleeves, long-sleeves, sweat-shirts and hoodies"],
        enum: {
            values: [
                'short-sleeves',
                'long-sleeves',
                'sweat-shirt',
                'hoodies'
            ],
            message: "Please select category only from- short-sleeves, long-sleeves, sweat-shirts and hoodies "
        }
    },
    brand:{
        type: String,
        require: [true, "Please provide product brand name"],
        trim: true,
    },
    ratings:{
        type: Number,
        default: 0
    },
    noOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },          
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    }
}, {timestamps:true})




module.exports = mongoose.model("Procuct", productSchema);