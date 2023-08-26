const express = require('express');
const router = express.Router();
const {isLoggedIn, customRole, isAdmin} = require('../middlewares/user');
const {adminGetOneUserOrders,createOrder,adminUpdateOrder, getOneOrder, adminDeleteOrder,getLoggedInOrders,adminGetAllOrders} = require('../controllers/orderController');



router.post('/order/create',isLoggedIn, createOrder);
router.get('/order/myorder',isLoggedIn, getLoggedInOrders);
router.get('/order/:id',isLoggedIn, getOneOrder);


// admin routes
router.get('/admin/order/all',isLoggedIn,customRole('admin'), adminGetAllOrders);
router.get('/admin/order/:id',isLoggedIn,customRole('admin'), adminGetOneUserOrders);
router.put('/admin/order/:id',isLoggedIn,customRole('admin'), adminUpdateOrder);
router.delete('/admin/order/:id',isLoggedIn,customRole('admin'), adminDeleteOrder);


// router.get('/order/myorder',isLoggedIn, getLoggedInOrders); // getOneOrder will execute 
// here cause /order/:id will treat /order/myorder => /myorder as id.
// so always put params route at the end or modify your route such a way 
// that it doesnot confilct with params route like; 
// router.get('/myorder',isLoggedIn, getLoggedInOrders);
//or
// router.get('/order/all/myorder',isLoggedIn, getLoggedInOrders);


module.exports = router;
