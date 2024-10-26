import { Badge, Col, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperAcccount, WrapperContentPopup, WrapperHeader, WrapperTextHeader, WrapperTextHeaderSmall } from './styled'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonSearch from '../ButtonSearch/ButtonSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import { searchProduct } from '../../redux/slides/productSlide';


const HeaderComponent = () => {

  const user = useSelector((state) => state.user)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [search,setSearch] = useState('')


  const order = useSelector((state) => state.order)


  const handleLogout = async () => {
    await UserService.logoutUser()
    dispatch(resetUser())
  }

  useEffect(() => {
    setUserName(user?.name)
  }, [user?.name])



  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (

        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === 'profile') {
      navigate('/profile-user')
    } else if (type === 'admin') {
      navigate('/system-admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleNavigateProfile = () => {
    navigate('/profile-user')
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div>
      <WrapperHeader>
        <Col span={6}>
          <WrapperTextHeader>Nin</WrapperTextHeader>
        </Col>
        <Col span={12} >
          <ButtonSearch
            placeholder="Nhập vào để tìm kiếm"
            size="small"
            textButton="Tìm Kiếm"
            onSearch={onSearch}
          />
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <WrapperAcccount>
            <UserOutlined style={{ fontSize: '24px', gap: '540px', alignItems: 'center' }} />
            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                </Popover>
              </>
            ) : (
              <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                <div>
                  <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                  <CaretDownOutlined />
                </div>
              </div>
            )}

            <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
              <Badge count={order?.orderItems?.length} size='small'>
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
            </div>
          </WrapperAcccount>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent