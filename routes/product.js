const express = require('express');
const router = express.Router();

const {isLoggedIn, customRole} = require('../middlewares/user');
const {product} = require('../controllers/productController')

router.get('/product', product);


module.exports = router;