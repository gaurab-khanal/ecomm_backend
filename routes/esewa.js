const express = require('express');
const router = express.Router();

const {verifyPayment} = require('../controllers/esewa');
const {getOrderForPayment} = require('../controllers/orderController');
const {createPayment} = require('../controllers/paymentController');


router.post('/esewa/verifyPayment',
verifyPayment,
getOrderForPayment,
createPayment);



module.exports = router;