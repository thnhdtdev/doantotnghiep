const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/productController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', ProductController.createProduct)
router.put('/update/:id', ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailProduct)
router.delete('/delete-product/:id',authMiddleWare ,ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.get('/get-all-type', ProductController.getAllType)


module.exports = router;