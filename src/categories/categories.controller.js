const express = require("express");
const {getAllCategories} = require("./categories");
const router = express.Router();

router.get("/",getAllCategories);
module.exports = router();