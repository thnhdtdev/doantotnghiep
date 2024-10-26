import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader } from '../HeaderComponent/styled';
import { Button, Form, Input, message, Select, Space } from 'antd';
import TableComponent from '../TableComponent/TableComponent';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getBase64, renderOption } from '../../until'
import { WrapperUploadFile } from './style';
import * as ProductService from '../../service/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import { createProduct } from '../../service/ProductService';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerCoponent/DrawerCoponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
import InputComponent from '../InputComponent/InputComponent';


const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const user = useSelector((state) => state?.user)

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '23px', cursor: 'pointer', paddingRight: '20px' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '23px', cursor: 'pointer' }} onClick={handleDetailsProduct} />

            </div>
        )
    }

    const inittial = () => ({
        name: '',
        price: '',
        description: '',
        image: '',
        type: '',
        countInStock: '',
        newType: '',
        discount: '',
    })
    const [stateProduct, setStateProduct] = useState(inittial());

    const [stateProductDetails, setStateProductDetails] = useState(inittial())

    const mutation = useMutationHook(
        (data) => {
            const { name,
                price,
                description,
                image,
                type,
                countInStock,
                discount } = data
            const res = ProductService.createProduct({
                name,
                price,
                description,
                image,
                type,
                countInStock,
                discount
            })
            return res
        }
    )

    const mutationUpdate = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDeleted = useMutationHook(
        (data) => {
            const { id,
                token,
            } = data
            const res = ProductService.deleteProduct(
                id,
                token)
            return res
        },
    )

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }


    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount
            })
        }
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateProductDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateProductDetails, isModalOpen])

    useEffect(() => {
        form.setFieldValue(stateProductDetails)
    }, [form, stateProductDetails])

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const { data, isSuccess, isError } = mutation
    const { data: product } = useQuery({ queryKey: ['product'], queryFn: getAllProduct })
    const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted

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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            filters: [
                {
                    text: '>= 500000',
                    value: '>=',
                },
                {
                    text: '<= 500000',
                    value: '<=',
                }
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 500000
                }
                return record.price <= 500000
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            filters: [
                {
                    text: 'Nệm',
                    value: 'Nệm',
                },
                {
                    text: 'Jim',
                    value: 'Jim',
                },
            ],
        },
    {
        title: 'Action',
        dataIndex: 'action',
        render: renderAction
    },
    ];

const dataTable = product?.data?.length && product?.data?.map((product) => {
    return { ...product, key: product._id }
})
const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
        name: '',
        price: '',
        description: '',
        image: '',
        type: '',
        countInStock: ''
    })
    form.resetFields()
};


useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
        handleCancel()
    } else if (isError) {
        message.error()
    }
}, [isSuccess])

useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
        message.success()
        handleCloseDrawer()
    } else if (isErrorUpdated) {
        message.error()
    }
}, [isSuccessUpdated])

useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
        handleCancelDelete()
    } else if (isErrorDeleted) {
    }
}, [isSuccessDelected])



const onFinish = () => {
    const params = {
        name: stateProduct.name,
        price: stateProduct.price,
        description: stateProduct.description,
        rating: stateProduct.rating,
        image: stateProduct.image,
        type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
        countInStock: stateProduct.countInStock,
        discount: stateProduct.discount
    }
    mutation.mutate(params, {
        onSettled: () => {
            queryProduct.refetch()
        }
    })
    createProduct()
};

const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
        name: '',
        price: '',
        description: '',
        discount: '',
        type: '',
        countInStock: '',
        image: ''
    })
    form.resetFields()
};

const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
}

const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
        onSettled: () => {
            queryProduct.refetch(); // Làm mới dữ liệu sau khi xóa thành công
            handleCancelDelete(); // Đóng modal sau khi xóa thành công
        },
        onSuccess: () => {
            message.success('Xóa sản phẩm thành công'); // Thông báo xóa thành công
        },
        onError: () => {
            message.error('Xóa sản phẩm thất bại'); // Thông báo xóa thất bại
        }
    });
};


const handleOnchange = (e) => {
    setStateProduct({
        ...stateProduct,
        [e.target.name]: e.target.value
    })
}
const handleOnchangeDetails = (e) => {
    setStateProductDetails({
        ...stateProductDetails,
        [e.target.name]: e.target.value
    })
}

const handleOnchangeImage = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
        ...stateProduct,
        image: file.preview
    })
}

const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
        onSettled: () => {
            queryProduct.refetch()
        }
    })
}

const handleChangeSelect = (value) => {
    setStateProduct({
        ...stateProduct,
        type: value
    })
}

return (
    <div>
        <WrapperHeader>Quản lý Sản phẩm</WrapperHeader>
        <div style={{ marginTop: '10px' }}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
                style={{ marginBottom: '20px' }}
            >
                Add Product
            </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
            <TableComponent columns={columns} data={dataTable} onRow={(record, rowIndex) => {
                return {
                    onClick: event => {
                        setRowSelected(record._id)
                    }
                };
            }} />
        </div>

        {/* Tạo sản phẩm */}
        <ModalComponent title="Tạo Sản Phẩm" open={isModalOpen} onCancel={handleCancel} >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}

            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your product name!' }]}
                >
                    <Input value={stateProduct.name} onChange={handleOnchange} name='name' />
                </Form.Item>

                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please input your product type!' }]}
                >
                    {/* <Input value={stateProduct.type} onChange={handleOnchange} name='type' /> */}
                    <Select
                        name="type"
                        // defaultValue="lucy"
                        // style={{ width: 120 }}
                        value={stateProduct.type}
                        onChange={handleChangeSelect}
                        options={renderOption(typeProduct?.data?.data)}
                    />
                </Form.Item>

                {stateProduct.type === 'add_type' && (
                    <Form.Item
                        label='New type'
                        name="newType"
                        rules={[{ required: true, message: 'Please input your type!' }]}
                    >
                        <Input value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                    </Form.Item>
                )}

                <Form.Item
                    label="Count in Stock"
                    name="countInStock"
                    rules={[{ required: true, message: 'Please input your count in stock!' }]}
                >
                    <Input value={stateProduct.countInStock} onChange={handleOnchange} name='countInStock' />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input your product price!' }]}
                >
                    <Input value={stateProduct.price} onChange={handleOnchange} name='price' />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input your product description!' }]}
                >
                    <Input value={stateProduct.description} onChange={handleOnchange} name='description' />
                </Form.Item>

                <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ required: true, message: 'Please input your product discount!' }]}
                >
                    <Input value={stateProduct.discount} onChange={handleOnchange} name='discount' />
                </Form.Item>

                <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: 'Please upload your product image!' }]}
                >
                    <WrapperUploadFile onChange={handleOnchangeImage} maxCount={1}>
                        <Button>Select File</Button>
                    </WrapperUploadFile>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </ModalComponent>

        {/* Cập nhật sản phẩm */}
        <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
            <Form
                form={form}
                name="basic1"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 12 }}
                onFinish={onUpdateProduct}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />
                </Form.Item>

                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please input your type!' }]}
                >
                    <Input value={stateProductDetails['type']} onChange={handleOnchangeDetails} name="type" />
                </Form.Item>
                <Form.Item
                    label="Count inStock"
                    name="countInStock"
                    rules={[{ required: true, message: 'Please input your count inStock!' }]}
                >
                    <Input value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input your count price!' }]}
                >
                    <Input value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input your count description!' }]}
                >
                    <Input value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
                </Form.Item>

                <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ required: true, message: 'Please input your discount of product!' }]}
                >
                    <Input value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
                </Form.Item>
                <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: 'Please input your count image!' }]}
                >
                    <WrapperUploadFile onChange={handleOnchangeImage} maxCount={1}>
                        <Button >Select File</Button>
                        {stateProductDetails?.image && (
                            <img src={stateProductDetails?.image} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginLeft: '10px'
                            }} alt="avatar" />
                        )}
                    </WrapperUploadFile>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Apply
                    </Button>
                </Form.Item>
            </Form>
        </DrawerComponent>

        {/* Xóa sản phẩm */}
        <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
            <div>Bạn có chắc muốn xóa sản phẩm này không?</div>
        </ModalComponent>


    </div>
);
};

export default AdminProduct;
