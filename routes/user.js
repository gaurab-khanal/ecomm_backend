const express = require('express');
const { signup, login, logout, forgetPassword, changePassword ,passwordReset, getLoggedInUserDetails, updateUserDetails, adminAllUser, managerAllUser, admingetOneUser, adminUpdateOneUserDetails, adminDeleteOneUser} = require('../controllers/userController');
const { isLoggedIn, customRole } = require('../middlewares/user');
const router = express.Router();



router.post('/signup', signup) // done 
router.post('/login', login)  // done
router.get('/logout', logout)  // done
router.post('/forgetPassword', forgetPassword) // done
router.put('/password/reset/:token', passwordReset) // done
router.get('/userDashboard', isLoggedIn,getLoggedInUserDetails) 
router.put('/userdashboard/update', isLoggedIn,updateUserDetails)
router.put('/password/update', isLoggedIn,changePassword)

// admin routes
// router.get('/admin/users',isLoggedIn, isAdmin, adminAllUser) //  m

router.get('/admin/users',isLoggedIn, customRole('admin'), adminAllUser) // done
router.get('/admin/user/:id',isLoggedIn, customRole('admin'), admingetOneUser) // done 
router.put('/admin/user/:id',isLoggedIn, customRole('admin'), adminUpdateOneUserDetails) // done
router.delete('/admin/user/:id',isLoggedIn, customRole('admin'), adminDeleteOneUser) // done

// manager routes
router.get('/manager/users',isLoggedIn, customRole('manager'), managerAllUser)




// router.route('/signup').post(signup)

module.exports = router;