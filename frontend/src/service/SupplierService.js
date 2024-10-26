// services/SupplierService.js

import axiosJWT from 'axios';

// Lấy tất cả nhà cung cấp
export const getAllSuppliers = async (access_token) => {
    try {
        const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/supplier/get-all`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// Tạo nhà cung cấp mới
export const createSupplier = async (access_token, data) => {
    try {
        const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/supplier/create`, data, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// Cập nhật nhà cung cấp
export const updateSupplier = async (access_token, id, data) => {
    try {
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/supplier/update/${id}`, data, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// Xóa nhà cung cấp
export const deleteSupplier = async (access_token, id) => {
    try {
        const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/supplier/delete/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};
