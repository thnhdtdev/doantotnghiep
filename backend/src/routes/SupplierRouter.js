// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplierController');

router.post('/create', SupplierController.createSupplier);
router.get('/get-all', SupplierController.getAllSuppliers);
router.put('/update/:id', SupplierController.updateSupplier);
router.delete('/delete/:id', SupplierController.deleteSupplier);

module.exports = router;