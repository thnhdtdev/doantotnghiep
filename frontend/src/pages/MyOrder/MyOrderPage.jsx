import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as OrderService from '../../service/OrderService';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { convertPrice } from '../../until';
import { WrapperItemOrder } from '../OrderPage/style';
import * as message from '../../components/MessageComponent/Message';
import { useMutationHook } from '../../hooks/useMutationHook';
import { WrapperContainer, WrapperFooterItem, WrapperHeaderItem, WrapperListOrder, WrapperStatus } from './style';
import io from 'socket.io-client';

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const socket = io('http://localhost:3000'); // Đảm bảo URL đúng với server WebSocket của bạn

  // Hàm để lấy tất cả các đơn hàng của người dùng
  const fetchMyOrders = async () => {
    if (!user?.id) return; // Kiểm tra xem user có tồn tại không
    try {
      const res = await OrderService.getOrderByUserId(user.id, user.access_token);
      return res.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  // Sử dụng `useQuery` để lấy tất cả các đơn hàng
  const queryOrders = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: fetchMyOrders,
  });

  const { data: orders, refetch } = queryOrders;
  console.log('orders', orders);

  useEffect(() => {
    // Lắng nghe sự kiện từ server khi trạng thái đơn hàng thay đổi
    socket.on('ORDER_STATUS_UPDATED', (message) => {
      if (message.userId === user.id) {
        refetch(); // Làm mới dữ liệu khi có thay đổi từ backend
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user.id, refetch]);

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    });
  };

  const mutation = useMutationHook(
    (data) => {
      const { id, token, orderItems, userId } = data;
      const res = OrderService.cancelOrder(id, token, orderItems, userId);
      return res;
    }
  );

  const handleCanceOrder = (order) => {
    mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        refetch(); // Làm mới dữ liệu sau khi hủy đơn hàng
      },
    });
  };

  const { isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message);
    } else if (isErrorCancle) {
      message.error();
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => (
      <WrapperHeaderItem key={order?._id}>
        <img src={order?.image}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px'
          }}
        />
        <div style={{
          width: 260,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: '10px'
        }}>{order?.name}</div>
        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
      </WrapperHeaderItem>
    ));
  };

  return (
    <WrapperContainer>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h4>Đơn hàng của tôi</h4>
        <WrapperListOrder>
          {orders?.map((order) => (
            <WrapperItemOrder key={order?._id}>
              <WrapperStatus>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                <div>
                  <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                  <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{order.shippingStatus}</span>
                </div>
                <div>
                  <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                  <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                </div>
              </WrapperStatus>
              {renderProduct(order?.orderItems)}
              <WrapperFooterItem>
                <div>
                  <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                  <span style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}>
                    {convertPrice(order?.totalPrice)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <ButtonComponent
                    onClick={() => handleCanceOrder(order)}
                    size={40}
                    styleButton={{
                      height: '36px',
                      border: '1px solid #9255FD',
                      borderRadius: '4px'
                    }}
                    textButton={'Hủy đơn hàng'}
                    styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                    disabled={order.shippingStatus === 'Đã giao'}  // Vô hiệu hóa nút nếu trạng thái là 'Đã giao'
                  />
                  <ButtonComponent
                    onClick={() => handleDetailsOrder(order?._id)}
                    size={40}
                    styleButton={{
                      height: '36px',
                      border: '1px solid #9255FD',
                      borderRadius: '4px'
                    }}
                    textButton={'Xem chi tiết'}
                    styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                  />
                </div>
              </WrapperFooterItem>
            </WrapperItemOrder>
          ))}
        </WrapperListOrder>
      </div>
    </WrapperContainer>
  );
};

export default MyOrderPage;
