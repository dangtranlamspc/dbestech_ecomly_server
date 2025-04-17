const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categories');


router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoriesById);

module.exports = router;