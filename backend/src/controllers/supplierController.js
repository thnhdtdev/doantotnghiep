const Supplier = require('../models/Supplier');

// Lấy tất cả các nhà cung cấp
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().populate('products');
        res.status(200).json({ status: 'OK', data: suppliers });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

// Tạo nhà cung cấp mới
const createSupplier = async (req, res) => {
    try {
        const { name, address, contactInfo } = req.body;
        const newSupplier = new Supplier({
            name,
            address,
            contactInfo
        });
        await newSupplier.save();
        res.status(201).json({ status: 'OK', message: 'Supplier created successfully', data: newSupplier });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

// Cập nhật nhà cung cấp
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, contactInfo } = req.body;
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { name, address, contactInfo },
            { new: true }
        );
        if (!updatedSupplier) return res.status(404).json({ status: 'ERR', message: 'Supplier not found' });
        res.status(200).json({ status: 'OK', message: 'Supplier updated successfully', data: updatedSupplier });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

// Xóa nhà cung cấp
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        if (!deletedSupplier) return res.status(404).json({ status: 'ERR', message: 'Supplier not found' });
        res.status(200).json({ status: 'OK', message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
