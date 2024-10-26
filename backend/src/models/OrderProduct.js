const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],

    //dia chi giao hang
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: Number, required: true },
    },

    //phuong thuc thanh toan
    paymentMethod: { type: String, require: true },
    itemsPrice: { type: Number, require: true },
    shippingPrice: { type: Number, require: true },
    totalPrice: { type: Number, require: true },
    //thong tin user
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //kiem tra da thanh toan chua
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    //kiem tra da giao hang chua
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    shippingStatus: { type: String, default: 'Đang chuẩn bị hàng' },

},
    {
        timestamps: true
    }
);
const Order = mongoose.model('Oder', orderSchema);
module.exports = Order;