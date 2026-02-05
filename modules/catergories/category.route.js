const express = require("express");
const router = express.Router();
const { postCategory, getAllCategories, deleteCategory, getCategory, updateCategory, getCount } = require("./category.controller");


router.post('/', postCategory);
router.get('/', getAllCategories);
router.delete('/:id', deleteCategory);
router.get('/:id', getCategory);
router.put('/:id', updateCategory);
router.get('/get/count', getCount)
module.exports = router;
