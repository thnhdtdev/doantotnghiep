import React from 'react';
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../until';
import { useSelector } from 'react-redux';

const OrderSucess = () => {
    const location = useLocation();
    const { state } = location;
    const order = useSelector((state) => state.order)
    console.log('location', location)

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                <h3>Đơn hàng đặt thành công</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperContainer>
                        <WrapperInfo>
                            <div style={{ fontSize: '16px', }}>
                                <Lable>Phương thức giao hàng</Lable>
                                <WrapperValue>
                                    <span style={{ fontSize: '16px', color: '#ea8500', fontWeight: 'bold' }}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                                </WrapperValue>
                            </div>
                        </WrapperInfo>
                        <WrapperInfo>
                            <div style={{ fontSize: '16px', }}>
                                <Lable>Phương thức thanh toán</Lable>
                                <WrapperValue>
                                    {orderContant.payment[state?.payment]}
                                </WrapperValue>
                            </div>
                        </WrapperInfo>
                        <WrapperItemOrderInfo>
                            {state?.orders?.map((item, index) => (
                                <WrapperItemOrder key={index}>
                                    <div style={{ width: '500px', display: 'flex', alignItems: 'center', gap: 4, overflowWrap: 'break-word', }}>
                                        <img style={{ width: '77px', height: '79px', objectFit: 'cover' }} src={item.image} alt={item.name} />
                                        <div style={{

                                            fontSize: 16,
                                            width: 260,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>{item.name}</div>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>
                                            <span style={{ fontSize: '16px', color: '#242424' }}>Giá tiền: {convertPrice(item.price)}</span>
                                        </span>
                                        <span>
                                            <span style={{ fontSize: '16px', color: '#242424' }}>Số lượng: {item.amount}</span>
                                        </span>
                                    </div>
                                </WrapperItemOrder>
                            ))}
                        </WrapperItemOrderInfo>
                        <div>
                            <span style={{ fontSize: '20px', color: 'red' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>
                        </div>
                    </WrapperContainer>
                </div>
            </div>
        </div>
    );
}

export default OrderSucess;
