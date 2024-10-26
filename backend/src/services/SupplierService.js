// services/SupplierService.js
const Supplier = require('../models/Supplier');

const createSupplier = async (name, address, contactInfo) => {
    try {
        const newSupplier = new Supplier({
            name,
            address,
            contactInfo,
            products: [],
        });

        await newSupplier.save();
        return newSupplier;
    } catch (error) {
        throw new Error('Failed to create supplier: ' + error.message);
    }
};

// Hàm lấy tất cả Suppliers
const getAllSuppliers = async () => {
    try {
        const suppliers = await Supplier.find().select('name address contactInfo products');
        return suppliers;
    } catch (error) {
        throw new Error('Failed to fetch suppliers: ' + error.message);
    }
};

const updateSupplier = async (id, data) => {
    return await Supplier.findByIdAndUpdate(id, data, { new: true });
};

const deleteSupplier = async (id) => {
    return await Supplier.findByIdAndDelete(id);
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier,
};
