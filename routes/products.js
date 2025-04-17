const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const productsReviewController =require('../controllers/reviews');

router.get('/', productsController.getProducts);
router.get('/search', productsController.searchProducts);

router.get('/:id', productsController.getProductById);
router.post('/:id/reviews', productsReviewController.leaveReview);
router.get('/:id/reviews', productsReviewController.getProductReviews);

module.exports = router;