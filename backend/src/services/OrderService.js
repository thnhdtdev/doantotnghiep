const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

// Hàm tạo đơn hàng mới
const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        // Lấy các thông tin đơn hàng mới
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder;  // Đảm bảo email được lấy từ newOrder
        try {
            // Kiểm tra và cập nhật số lượng sản phẩm trong kho
            const updatePromises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,//tìm id
                        countInStock: { $gte: order.amount } //kiem tra so luong còn du trong kho khong
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,//giam so luong trong kho
                            selled: +order.amount//tang so luong san pham da ban
                        }
                    },
                    { new: true }
                );

                if (!productData) {
                    // Trả về sản phẩm không đủ số lượng
                    return { status: 'ERR', id: order.product };
                }
                return { status: 'OK' };
            });

            const results = await Promise.all(updatePromises);

            // Kiểm tra các sản phẩm không đủ số lượng
            const outOfStockItems = results.filter(result => result.status === 'ERR');
            if (outOfStockItems.length > 0) {
                const arrId = outOfStockItems.map(item => item.id);//lay danh sach cac san pham khong du hang
                return resolve({
                    status: 'ERR',
                    message: `Sản phẩm với ID: ${arrId.join(', ')} không đủ hàng.`
                });
            }

            // Tạo đơn hàng sau khi tất cả sản phẩm đã được cập nhật thành công
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                paidAt,
                email
            });

            // Gửi email sau khi tạo đơn hàng
            try {
                await EmailService.sendEmailCreateOrder(email, orderItems);  // Truyền biến email và orderItems đúng cách
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                // Xử lý lỗi gửi email nếu cần
            }

            resolve({
                status: 'OK',
                message: 'Đơn hàng đã được tạo thành công.',
                data: createdOrder
            });

        } catch (e) {
            console.error('Error:', e);
            reject({
                status: 'ERR',
                message: e.message || 'Failed to create order'
            });
        }
    });
}

// Lấy thông tin chi tiết đơn hàng theo user ID
const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id//tìm tất cả đơn hàng của người dùng
            })

            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

// Hủy đơn hàng và cập nhật số lượng sản phẩm trong kho
const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product, //tìm sản phẩm theo id
                        selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,//tăng lại số lượng trong kho
                            selled: -order.amount// giảm số lượng đã bán
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id) // xóa đơn hàng
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id

            if (newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

// Lấy tất cả các đơn hàng
const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 }) //sắp xếp đơn hàng theo thời gian tạo
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (orderId, updateData) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, // Tìm đơn hàng bằng orderId
            updateData, // Cập nhật trường shippingStatus và isPaid nếu cần
            { new: true } // Trả về tài liệu đã cập nhật
        );

        return updatedOrder; // Trả về đơn hàng đã cập nhật
    } catch (error) {
        console.error('Error in updateOrderStatus service:', error);
        throw new Error('Failed to update order status');
    }
};

module.exports = {
    createOrder,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus
}