// AdminStatsPage.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as AdminService from '../../service/AdminService';
import { useQuery } from '@tanstack/react-query';

const AdminStatsPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    // Nếu không phải admin, chuyển hướng về trang chủ hoặc trang đăng nhập
    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchStats = async () => {
        const res = await AdminService.getStats(user.access_token);
        return res.data;
    };

    const { data: stats, error } = useQuery(['adminStats'], fetchStats);

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Thống kê Admin</h1>
            <p>Tổng số đơn hàng: {stats?.totalOrders}</p>
            <p>Tổng doanh thu: {stats?.totalRevenue}</p>
            <p>Số đơn hàng đã hủy: {stats?.totalCanceledOrders}</p> {/* Thêm thông tin số đơn hàng đã hủy */}
        </div>
    );
};

export default AdminStatsPage;
