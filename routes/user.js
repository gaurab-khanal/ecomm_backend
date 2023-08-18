const express = require('express');
const { signup, login, logout, forgetPassword, changePassword ,passwordReset, getLoggedInUserDetails, updateUserDetails, adminAllUser, managerAllUser, admingetOneUser, adminUpdateOneUserDetails, adminDeleteOneUser} = require('../controllers/userController');
const { isLoggedIn, customRole } = require('../middlewares/user');
const router = express.Router();



router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgetPassword', forgetPassword)
router.put('/password/reset/:token', passwordReset)
router.get('/userDashboard', isLoggedIn,getLoggedInUserDetails)
router.put('/password/update', isLoggedIn,changePassword)
router.put('/userdashboard/update', isLoggedIn,updateUserDetails)

// admin routes
// router.get('/admin/users',isLoggedIn, isAdmin, adminAllUser) //  m

router.get('/admin/users',isLoggedIn, customRole('admin'), adminAllUser)
router.get('/admin/user/:id',isLoggedIn, customRole('admin'), admingetOneUser)
router.put('/admin/user/:id',isLoggedIn, customRole('admin'), adminUpdateOneUserDetails)
router.delete('/admin/user/:id',isLoggedIn, customRole('admin'), adminDeleteOneUser)

// manager routes
router.get('/manager/users',isLoggedIn, customRole('manager'), managerAllUser)




// router.route('/signup').post(signup)

module.exports = router;