const express = require("express");
const router = express.Router();

const checkoutControlller = require('../controllers/checkout')

router.post('/', checkoutControlller.checkout);
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  checkoutControlller.webhook
);

module.exports = router;


