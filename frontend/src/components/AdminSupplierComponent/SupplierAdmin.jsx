import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../service/SupplierService';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WrapperHeader } from '../OrderAdmin/style';

const SupplierManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingSupplier, setEditingSupplier] = useState(null);
    const user = useSelector((state) => state.user);
    const access_token = user?.access_token;

    const queryClient = useQueryClient();

    // Fetch all suppliers
    const { data: suppliers, isError } = useQuery({
        queryKey: ['suppliers'],
        queryFn: () => getAllSuppliers(access_token),
        onError: (error) => message.error(`Failed to fetch suppliers: ${error.message}`),
    });

    // Mutations
    const addSupplierMutation = useMutation({
        mutationFn: (newSupplier) => createSupplier(access_token, newSupplier),
        onSuccess: () => {
            message.success('Supplier added successfully!');
            queryClient.invalidateQueries(['suppliers']);
            setIsModalOpen(false);
            form.resetFields();
        },
        onError: (error) => {
            console.log('first', error)
            message.error(`Failed to add supplier: ${error.message}`);
        }
    });

    const updateSupplierMutation = useMutation({
        mutationFn: ({ id, updatedSupplier }) => updateSupplier(access_token, id, updatedSupplier),
        onSuccess: () => {
            message.success('Supplier updated successfully!');
            queryClient.invalidateQueries(['suppliers']);
            setIsModalOpen(false);
            setEditingSupplier(null);
            form.resetFields();
        },
        onError: (error) => {
            message.error(`Failed to update supplier: ${error.message}`);
        }
    });

    const deleteSupplierMutation = useMutation({
        mutationFn: (id) => deleteSupplier(access_token, id),
        onSuccess: () => {
            message.success('Supplier deleted successfully!');
            queryClient.invalidateQueries(['suppliers']);
        },
        onError: (error) => {
            message.error(`Failed to delete supplier: ${error.message}`);
        }
    });

    // Handle Add or Update Supplier
    const handleSubmit = (values) => {
        const supplierData = {
            name: values.name,
            address: values.address,
            contactInfo: {
                phone: values.phone,
                email: values.email
            }
        };

        if (editingSupplier) {
            updateSupplierMutation.mutate({ id: editingSupplier._id, updatedSupplier: supplierData });
        } else {
            addSupplierMutation.mutate(supplierData);
        }
    };
    // Handle Delete Supplier
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this supplier?',
            onOk: () => {
                deleteSupplierMutation.mutate(id);
            }
        });
    };

    // Open Modal to Add or Edit Supplier
    const handleOpenModal = (supplier = null) => {
        setIsModalOpen(true);
        setEditingSupplier(supplier);
        if (supplier) {
            form.setFieldsValue({
                name: supplier.name,
                address: supplier.address,
                phone: supplier.contactInfo?.phone,
                email: supplier.contactInfo?.email,
            });
        } else {
            form.resetFields();
        }
    };

    // Columns for Table
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone',
            dataIndex: ['contactInfo', 'phone'], // Access nested contactInfo.phone
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: ['contactInfo', 'email'], // Access nested contactInfo.email
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <DeleteOutlined style={{ color: 'red', fontSize: '23px', cursor: 'pointer', paddingRight: '20px' }} onClick={() => handleOpenModal(record)} />
                    <EditOutlined style={{ color: 'orange', fontSize: '23px', cursor: 'pointer' }} onClick={() => handleDelete(record._id)} />
                </div>
            )
        }
    ];

    return (
        <div>
            <WrapperHeader>Supplier Management</WrapperHeader>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                style={{ marginBottom: '20px' }}
            >
                Add Supplier
            </Button>

            <Table
                dataSource={suppliers?.data}
                columns={columns}
                rowKey={(record) => record._id}
            />

            <Modal
                title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Supplier Name"
                        rules={[{ required: true, message: 'Please enter the supplier name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Contact Phone"
                        rules={[{ required: true, message: 'Please enter the contact phone!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please enter the email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplierManagement;
