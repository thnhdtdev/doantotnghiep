import { Button, Form, Space, Select } from 'antd';
import React from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import * as OrderService from '../../service/OrderService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { orderContant } from '../../contant';
import { convertPrice } from '../../until';

const { Option } = Select;

const OrderAdmin = () => {
    const user = useSelector((state) => state?.user);
    const queryClient = useQueryClient();

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const { data: orders } = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrder,
    });

    // Sử dụng useMutation để cập nhật trạng thái giao hàng
    const mutation = useMutation({
        mutationFn: ({ access_token, orderId, shippingStatus }) =>
            OrderService.updateOrderStatus(access_token, orderId, shippingStatus),
        onSuccess: () => {
            console.log('Order status updated successfully'); // Thêm log để kiểm tra
            queryClient.invalidateQueries({ queryKey: ['orders'] }); // Làm mới dữ liệu sau khi cập nhật thành công
        },
        onError: (error) => {
            console.error('Error updating order status:', error); // Thêm log để kiểm tra lỗi
        },
    });

    // Hàm xử lý thay đổi trạng thái
    const handleStatusChange = (orderId, status) => {
        console.log('Changing status for order:', orderId, 'to:', status); // Thêm log để kiểm tra
        const access_token = user?.access_token;
        mutation.mutate({ access_token, orderId, shippingStatus: status });
    };

    const columns = [
        {
            title: 'User name',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.length - b.userName.length,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
        },
        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
        },
        {
            title: 'Total price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
        },
        {
            title: 'Shipping Status',
            dataIndex: 'shippingStatus',
            sorter: (a, b) => a.shippingStatus.length - b.shippingStatus.length,
            render: (text, record) => (
                <Select
                    value={text}
                    onChange={(value) => handleStatusChange(record.key, value)} // Thay đổi trạng thái đơn hàng
                    style={{ width: 150 }}
                >
                    <Option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</Option>
                    <Option value="Đang giao">Đang giao</Option>
                    <Option value="Đã giao">Đã giao</Option>
                </Select>
            ),
        },
    ];

    const dataTable = orders?.data?.map((order) => ({
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        totalPrice: convertPrice(order?.totalPrice),
        shippingStatus: order?.shippingStatus,
        deliveredAt: order?.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Not Delivered',
    }));

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} data={dataTable} />
            </div>
        </div>
    );
};

export default OrderAdmin;
