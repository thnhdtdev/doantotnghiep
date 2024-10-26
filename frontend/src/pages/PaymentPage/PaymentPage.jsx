import React, { useEffect, useState } from 'react';
import { Button, Form, Radio } from 'antd';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../until';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../service/UserService';
import * as OrderService from '../../service/OrderService';
import * as message from '../../components/MessageComponent/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import * as PaymentService from '../../service/PaymentService';
import { WrapperButtonMore } from '../HomePage/style';

const PaymentPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);

    const [delivery, setDelivery] = useState('fast');
    const [payment, setPayment] = useState('later_money');
    const navigate = useNavigate();
    const [sdkReady, setSdkReady] = useState(false);
    const [clientId, setClientId] = useState('');

    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    });
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            });
        }
    }, [isOpenModalUpdateInfo]);

    useEffect(() => {
        const loadPayPalScript = async () => {
            const { data } = await PaymentService.getConfig();
            setClientId(data);
            setSdkReady(true);
        };

        loadPayPalScript();
    }, []);

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + (cur.price * cur.amount);
        }, 0);
        return result;
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0;
            return total + (priceMemo * (totalDiscount * cur.amount) / 100);
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [order]);

    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo > 200000) {
            return 10000;
        } else if (priceMemo === 0) {
            return 0;
        } else {
            return 20000;
        }
    }, [priceMemo]);

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo);
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSlected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
            mutationAddOrder.mutate(
                {
                    token: user?.access_token,
                    orderItems: order?.orderItemsSlected,
                    fullName: user?.name,
                    address: user?.address,
                    phone: user?.phone,
                    city: user?.city,
                    paymentMethod: payment,
                    itemsPrice: priceMemo,
                    shippingPrice: diliveryPriceMemo,
                    totalPrice: totalPriceMemo,
                    user: user?.id,
                    email: user?.email
                }
            );
        }
    };

    const mutationUpdate = useMutationHook(
        (data) => {
            const { id, token, ...rests } = data;
            const res = UserService.updateUser(id, { ...rests }, token);
            return res;
        },
    );

    const mutationAddOrder = useMutationHook(
        (data) => {
            const { token, ...rests } = data;
            const res = OrderService.createOrder({ ...rests }, token);
            return res;
        },
    );

    const { data } = mutationUpdate;
    const { data: dataAdd, isSuccess, isError } = mutationAddOrder;

    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = [];
            order?.orderItemsSlected?.forEach(element => {
                arrayOrdered.push(element.product);
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
            message.success('Đặt hàng thành công');
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSlected,
                    totalPriceMemo: totalPriceMemo
                }
            });
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    const handleCancleUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };

    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate(
            {
                token: user?.access_token,
                orderItems: order?.orderItemsSlected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                isPaid: true,
                paidAt: details.update_time,
                email: user?.email
            }
        );
    };

    const handleUpdateInforUser = () => {
        const { name, address, city, phone } = stateUserDetails;
        if (name && address && city && phone) {
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone }));
                    setIsOpenModalUpdateInfo(false);
                }
            });
        }
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleDilivery = (e) => {
        setDelivery(e.target.value);
    };

    const handlePayment = (e) => {
        setPayment(e.target.value);
    };

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                <h3>Thanh toán</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperLeft>
                        <WrapperInfo>
                            <div>
                                <Lable>Chọn phương thức giao hàng</Lable>
                                <WrapperRadio onChange={handleDilivery} value={delivery}>
                                    <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                                    <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                </WrapperRadio>
                            </div>
                        </WrapperInfo>
                        <WrapperInfo>
                            <div>
                                <Lable>Chọn phương thức thanh toán</Lable>
                                <WrapperRadio onChange={handlePayment} value={payment}>
                                    <Radio value="later_money">Thanh toán tiền mặt khi nhận hàng</Radio>
                                    <Radio value="paypal">Thanh toán bằng PayPal</Radio>
                                </WrapperRadio>
                            </div>
                        </WrapperInfo>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo>
                                <div style={{fontSize:'16px',}}>
                                    <span>Địa chỉ: </span>
                                    <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`}</span>
                                    <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>  Thay đổi</span>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '16px' }}>
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold', fontSize: '16px' }}>{convertPrice(priceMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '16px' }}>
                                    <span>Giảm giá</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold', fontSize: '16px' }}>{convertPrice(priceDiscountMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '16px' }}>
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold', fontSize: '16px' }}>{convertPrice(diliveryPriceMemo)}</span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span style={{ fontSize: '16px' }}>Tổng tiền</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                </span>
                            </WrapperTotal>
                        </div>
                        {payment === 'paypal' && sdkReady ? (
                            <PayPalScriptProvider options={{ "client-id": clientId }}>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: (totalPriceMemo / 23000).toFixed(2) // Chuyển đổi VND sang USD
                                                }
                                            }]
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            onSuccessPaypal(details, data);
                                        });
                                    }}
                                    onError={(err) => {
                                        console.error('PayPal Checkout onError', err);
                                        message.error('There was an issue with the payment.');
                                    }}
                                />
                            </PayPalScriptProvider>
                        ) : (
                            <WrapperButtonMore
                                onClick={() => handleAddOrder()}
                                size={40}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}
                                textButton={'Đặt hàng'}
                            ></WrapperButtonMore>
                        )}
                    </WrapperRight>
                </div>
            </div>
            <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please input your city!' }]}
                    >
                        <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your  phone!' }]}
                    >
                        <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Adress"
                        name="address"
                        rules={[{ required: true, message: 'Please input your  address!' }]}
                    >
                        <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                    </Form.Item>
                </Form>
            </ModalComponent>
        </div>
    );
}

export default PaymentPage;
