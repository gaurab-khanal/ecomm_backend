const express = require('express');
const router = express.Router();

const {home} = require("../controllers/homeController")

router.get('/dummy', home)



module.exports = router;
