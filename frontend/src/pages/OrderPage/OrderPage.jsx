import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailComponent/style'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import * as message from '../../components/MessageComponent/Message'
import { useMutationHook } from '../../hooks/useMutationHook';
import * as  UserService from '../../service/UserService'
import { Input, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import StepComponent from '../../components/StepComponent/StepComponent'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../until'
import { WrapperButtonMore } from '../HomePage/style'



const OrderPage = () => {

  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    console.log('result', result)
    return result
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur.amount) / 100)
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])




  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 20000 && priceMemo < 500000) {
      return 10000
    } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === 'increase') {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }))
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }))
      }
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }


  const itemsDelivery = [
    {
      title: '20.000 VND',
      description: 'Dưới 200.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
    },
    {
      title: 'Free ship',
      description: 'Trên 500.000 VND',
    },
  ]

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }))
  }

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const mutationUpdate = useMutationHook(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])



  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(UserService.updateUser({ name, address, city, phone }))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }

  const handleAddCard = () => {
    if (!order?.orderItemsSlected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment')
    }
  }

  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h2 style={{ fontWeight: 'bold' }}>Giỏ hàng</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <h2>Phí giao hàng</h2>
            <WrapperStyleHeaderDilivery>
              <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 10000
                ? 1 : diliveryPriceMemo === 20000 ? 2
                  : order.orderItemsSlected.length === 0 ? 0 : 3} />
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }}>
                <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></CustomCheckbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                      <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                      <div style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{order?.name}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                      </span>
                      <WrapperCountOrder>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}>
                          <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                        <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product, order?.amount === order.countInstock, order?.amount === 1)}>
                          <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                      </WrapperCountOrder>
                      <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{convertPrice(order?.price * order?.amount)}</span>
                      <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                    </div>
                  </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: '100%' }}>
              <WrapperInfo>
                <div style={{ fontSize: '16px' }}>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`} </span>
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
                <span style={{fontSize:'16px'}}>Tổng tiền</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                  <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
              <WrapperButtonMore onClick={() => handleAddCard()} type="outline" textButton="Mua Hàng" />
            </div>

          </WrapperRight>
        </div>
      </div>
      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          // onFinish={onUpdateUser}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input your city!' }]}
          >
            <Input value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <Input value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
          </Form.Item>

          <Form.Item
            label="Adress"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  )
}

export default OrderPage