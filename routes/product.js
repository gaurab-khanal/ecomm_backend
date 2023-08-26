const express = require('express');
const router = express.Router(); 
const {isLoggedIn, customRole} = require('../middlewares/user');
const {addProduct, getAllProducts, adminUpdateOneProduct , adminGetAllProducts, getSingleProducts, adminDeleteOneProduct, addReview, deleteReview, getOnlyReviewsForOneProduct} = require('../controllers/productController')

//user routes
router.get('/products', getAllProducts);
router.get('/products/:id', getSingleProducts);

//review routes user
router.put('/product/review', isLoggedIn , addReview); // recheck to add isloggedin
router.delete('/product/review', isLoggedIn ,deleteReview)
router.get('/product/reviews', getOnlyReviewsForOneProduct)


//admin routes
router.post('/admin/product/add',isLoggedIn, customRole("admin"),addProduct);
router.get('/admin/products',isLoggedIn, customRole("admin"),adminGetAllProducts);
router.put('/admin/products/:id',isLoggedIn, customRole("admin"),adminUpdateOneProduct);
router.delete('/admin/products/:id',isLoggedIn, customRole("admin"),adminDeleteOneProduct);



module.exports = router;