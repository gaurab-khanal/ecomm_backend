const express = require('express');
const { signup, login, logout, forgetPassword, passwordReset} = require('../controllers/userController');
const router = express.Router();


router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgetPassword', forgetPassword)
router.post('/password/reset/:token', passwordReset)

// router.route('/signup').post(signup)

module.exports = router;