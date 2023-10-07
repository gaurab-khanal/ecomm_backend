const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        phoneNo:{
            type: String,
            required: true
        },
        postalCode:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Procuct',
                required: true
            },
        }
    ],
    payment_method: {
        type: String,
        required: true,
        default: 'esewa'
    },
    taxAmount: {
        type: Number,
        required: true
    },
    shippingAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: {
        type: Date
    }
}, {timestamps: true})


module.exports = mongoose.model("Order", orderSchema);