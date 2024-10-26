import { axiosJWT } from "./UserService"
import axios from 'axios';


export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create/${data.user}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderByUserId = async (orderId, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${orderId}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }

    })
    return res.data
}

export const cancelOrder = async (id, access_token, orderItems, userId) => {
    const data = { orderItems, orderId: id }
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${userId}`, { data }, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const updateOrderStatus = async (access_token, orderId, shippingStatus) => {
    try {
        const res = await axiosJWT.put(
            `${process.env.REACT_APP_API_URL}/order/update-status`,
            { orderId, shippingStatus }, // Dữ liệu gửi đi
            {
                headers: {
                    token: `Bearer ${access_token}`, // Sử dụng Bearer token
                }
            }
        );
        console.log('API response:', res.data); // Thêm log để kiểm tra phản hồi từ API
        return res.data;
    } catch (error) {
        console.error('Error updating order status:', error); // Thêm log để kiểm tra lỗi
        throw error;
    }
};


