import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../until';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import AdminUser from '../../components/AdminUserComponent/AdminUser';
import AdminProduct from '../../components/AdminProductComponent/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
import SupplierAdmin from '../../components/AdminSupplierComponent/SupplierAdmin';


const AdminPage = () => {
    const user = useSelector((state) => state?.user)

    const items = [
        getItem('Người dùng', 'users', <UserOutlined />),
        getItem('Sản phẩm', 'products', <AppstoreOutlined />),
        getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
        getItem('Nhà cung cấp', 'supplier', <ShoppingCartOutlined />),
    ];

    const [keySelected, setKeySelected] = useState('')

    const renderPage = (key) => {
        switch (key) {
            case 'users':
                return (
                    <AdminUser />
                )
            case 'products':
                return (
                    <AdminProduct />
                )
            case 'orders':
                return (
                    <OrderAdmin />
                )
            case 'supplier':
                return (
                    <SupplierAdmin />
                )
            default:
                return <></>
        }
    }

    const handleOnCLick = ({ key }) => {
        setKeySelected(key);
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh'
                    }}
                    items={items}
                    onClick={handleOnCLick}
                />
                <div style={{ flex: '1', padding: '15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    )

}

export default AdminPage