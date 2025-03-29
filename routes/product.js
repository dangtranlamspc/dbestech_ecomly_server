const router = express().Router();
const productControllers = require('../controllers/product');

router.get('/products/count', productControllers.getProductsCount);
router.get('/products/:id', productControllers.getProductDetails);

router.delete('/products/:id', (req, res) => {
});
router.put('/products/:id');

module.exports = router;