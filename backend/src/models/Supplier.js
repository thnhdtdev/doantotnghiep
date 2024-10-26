const mongoose = require('mongoose');

// Định nghĩa schema cho Supplier
const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false, // Cho phép trống nếu không cần thiết
    },
    contactInfo: {
        phone: {
            type: String,
            required: false, // Cho phép trống nếu không cần thiết
        },
        email: {
            type: String,
            required: false, // Cho phép trống nếu không cần thiết
        },
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Tham chiếu tới model 'Product'
        required: false, // Cho phép trống nếu không cần thiết
    }]
}, { timestamps: true }); // Tự động thêm trường `createdAt` và `updatedAt`

// Export model Supplier
module.exports = mongoose.model('Supplier', SupplierSchema);
