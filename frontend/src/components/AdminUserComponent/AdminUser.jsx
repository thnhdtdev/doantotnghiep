import { Button, Form, Input, Space } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerCoponent/DrawerCoponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import * as message from '../../components/MessageComponent/Message';
import { useSelector } from 'react-redux';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../service/UserService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState(''); // Lưu trạng thái của dòng được chọn
    const [isOpenDrawer, setIsOpenDrawer] = useState(false); // Trạng thái mở/đóng Drawer
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false); // Trạng thái mở/đóng Modal xóa người dùng
    const user = useSelector((state) => state?.user); // Lấy thông tin người dùng từ Redux store
    const searchInput = useRef(null); // Tham chiếu đến Input của tìm kiếm
    const queryClient = useQueryClient(); // Sử dụng React Query để quản lý cache
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        address: ''
    }); // Quản lý trạng thái chi tiết của người dùng

    const [form] = Form.useForm(); // Ant Design form management

    // Fetch tất cả người dùng
    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: () => UserService.getAllUser(user?.access_token), // Lấy tất cả người dùng từ API
        enabled: !!user?.access_token, // Chỉ kích hoạt khi có token
    });

    // Hàm cập nhật người dùng
    const mutationUpdate = useMutationHook((data) => {
        const { id, token, ...rests } = data;
        return UserService.updateUser(id, { ...rests }, token); // Gọi API cập nhật người dùng
    });

    // Hàm xóa người dùng
    const mutationDeleted = useMutationHook((data) => {
        const { id, token } = data;
        return UserService.deleteUser(id, token); // Gọi API xóa người dùng
    });

    // Lấy thông tin chi tiết người dùng
    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailUser(rowSelected); // Gọi API lấy chi tiết người dùng
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res.data?.avatar
            });
        }
    };

    // Hiển thị thông tin người dùng vào form
    useEffect(() => {
        form.setFieldsValue(stateUserDetails); // Đặt các giá trị vào form từ stateUserDetails
    }, [form, stateUserDetails]);

    // Mở Drawer và lấy chi tiết người dùng khi có rowSelected
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetDetailsUser(rowSelected); // Lấy chi tiết người dùng khi mở Drawer
        }
    }, [rowSelected, isOpenDrawer]);

    // Đóng Drawer và reset form
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
            address: ''
        });
        form.resetFields();
    };

    // Xử lý khi xóa người dùng
    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSuccess: () => {
                message.success('User deleted successfully!'); // Thông báo xóa thành công
                queryClient.invalidateQueries(['users']); // Làm mới dữ liệu người dùng
            },
            onError: (error) => {
                message.error(`Failed to delete user: ${error.message}`); // Thông báo lỗi nếu xóa thất bại
            }
        });
    };

    // Cập nhật thông tin người dùng
    const onUpdateUser = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateUserDetails }, // Dữ liệu gửi lên để cập nhật
            {
                onSettled: () => {
                    queryClient.invalidateQueries(['users']); // Làm mới dữ liệu người dùng sau khi cập nhật
                    handleCloseDrawer(); // Đóng Drawer sau khi cập nhật
                }
            }
        );
    };
   

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });

    // Các cột trong bảng
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name') // Thêm tìm kiếm vào cột 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email') // Thêm tìm kiếm vào cột 'email'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ...getColumnSearchProps('address') // Thêm tìm kiếm vào cột 'address'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone') // Thêm tìm kiếm vào cột 'phone'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <div>
                    <DeleteOutlined
                        style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                        onClick={() => setIsModalOpenDelete(true)} // Mở modal xác nhận xóa người dùng
                    />
                    <EditOutlined
                        style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
                        onClick={() => setIsOpenDrawer(true)} // Mở Drawer chỉnh sửa người dùng
                    />
                </div>
            )
        },
    ];

    // Xử lý khi thay đổi chi tiết người dùng
    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        });
    };

    // Chuyển dữ liệu người dùng sang định dạng bảng
    const dataTable = users?.data?.map((user) => ({
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'
    }));

    // Đóng Modal xác nhận xóa
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns} // Hiển thị các cột
                    data={dataTable} // Hiển thị dữ liệu người dùng
                    onRow={(record) => ({
                        onClick: () => setRowSelected(record._id) // Chọn dòng khi click
                    })}
                />
            </div>

            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Form
                    form={form}
                    name="basic1"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 12 }}
                    onFinish={onUpdateUser} // Gửi form cập nhật thông tin người dùng
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                        <Input value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerComponent>

            <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <div>Bạn có chắc xóa tài khoản này không?</div>
            </ModalComponent>
        </div>
    );
};

export default AdminUser;
