const express = require('express');
const { signup, login } = require('../controllers/userController');
const router = express.Router();


router.post('/signup', signup)

router.post('/login', login)
// router.route('/signup').post(signup)

module.exports = router;