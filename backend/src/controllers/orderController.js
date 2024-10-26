const Order = require('../models/OrderProduct')
const OrderService = require('../services/OrderService')

// Hàm tạo đơn hàng mới
const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body
        //Kiểm tra dữ liệu đầu vào có bị thiếu không
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        // console.log("Request body:", req.body); // Log dữ liệu nhận được
        // Gọi service để tạo đơn hàng với thông tin từ request body
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e.message || 'An unexpected error occurred'
        })
    }
}

// Hàm lấy thông tin chi tiết đơn hàng
const getDetailsOrder = async (req, res) => {
    try {
        const userId = req.params.id //Lấy id
        console.log('first', userId)

        //Kiểm tra userID
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        // Gọi service để lấy chi tiết đơn hàng
        const response = await OrderService.getOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
};


// Hàm hủy đơn hàng
const cancelOrderDetails = async (req, res) => {
    try {
        const data= req.body.orderItems //Lấy thông tin đơn hàng từ body
        const orderId= req.body.orderId

        //Kiểm tra orderID có được cấp không
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        //Gọi service để hủy
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm lấy tất cả các đơn hàng
const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shippingStatus } = req.body;

        // Kiểm tra xem orderId và shippingStatus có được cung cấp không
        if (!orderId || !shippingStatus) {
            return res.status(400).json({ status: 'ERR', message: 'Order ID and shipping status are required' });
        }

        // Tạo updatedata để cập nhật trạng thái giao hàng
        let updateData = { shippingStatus };

        // Nếu trạng thái giao hàng là "đã giao", thì cập nhật trạng thái thanh toán thành "đã thanh toán"
        if (shippingStatus === 'Đã giao') {
            updateData.isPaid = true; // Cập nhật trạng thái thanh toán
        }

        const updatedOrder = await OrderService.updateOrderStatus(orderId, updateData);

        if (!updatedOrder) {
            return res.status(404).json({ status: 'ERR', message: 'Order not found' });
        }

        // Lấy Socket.IO instance từ Express app
        const io = req.app.get('socketio');
        if (io) {
            // Thông báo cập nhật trạng thái đơn hàng
            io.emit('ORDER_STATUS_UPDATED', { orderId, shippingStatus: updateData.shippingStatus, isPaid: updateData.isPaid, userId: updatedOrder.user });
        } else {
            console.error('Socket.IO instance not found');
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Order status updated successfully',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            status: 'ERR',
            message: 'An error occurred while updating order status',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus
}