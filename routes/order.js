const express = require('express')
const router = express.Router();

const orderController = require('../controllers/order');

router.get('/users/:userId', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
