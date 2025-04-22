const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');
const wishListController = require('../controllers/wishList');
const cartController = require('../controllers/cart');

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);


router.get('/:id/wishlist', wishListController.getUserWishList);
router.post('/:id/wishlist', wishListController.addToWishList);
router.delete('/:id/wishlist/:productId', wishListController.removeFromWishList);

router.get('/:id/cart', cartController.getUserCart);
router.get('/:id/cart/count', cartController.getUserCartCount);
router.get('/:id/cart/:cartProductId', cartController.getCartProductById);
router.post('/:id/cart', cartController.addToCart);
router.put('/:id/cart/:cartProductId', cartController.mofifyProductQuantity);
router.delete('/:id/cart/:cartProductId', cartController.removeFromCart);

module.exports = router;