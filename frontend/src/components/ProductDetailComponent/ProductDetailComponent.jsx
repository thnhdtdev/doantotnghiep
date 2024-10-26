import { Col, Image, Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import imageProductSmall from '../../assets/images/imagesmall.png'
import icon1 from '../../assets/images/icon1.png'
import icon2 from '../../assets/images/icon2.png'
import icon3 from '../../assets/images/icon3.png'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleAddToCart, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStylePolicy, WrapperStylePolicyText, WrapperStylePrice, WrapperStylePriceCompare } from './style'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../service/ProductService'
import { useDispatch, useSelector } from 'react-redux'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../until'
import * as message from '../../components/MessageComponent/Message'


const ProductDetailComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)


    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const { data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
    });


    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if(productDetails?.countInStock === 0){
            setErrorLimitOrder(true)
        }
    },[numProduct])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng');
            dispatch(resetOrder()); // Đặt lại trạng thái sau khi hiển thị thông báo
        }
    }, [order.isSucessOrder, dispatch]);



    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            // {
            //     name: { type: String, required: true },
            //     amount: { type: Number, required: true },
            //     image: { type: String, required: true },
            //     price: { type: Number, required: true },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         required: true,
            //     },
            // },
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

    return (

        <Row style={{ padding: '16px' }}>
            <Col span={10} style={{ padding: '15px' }}>
                <Image src={productDetails?.image} alt='image product' preview={false} />
                <Row style={{ paddingTop: '5px', justifyContent: 'space-between' }}>
                    <Col span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                    </Col>
                    <Col span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                    </Col>
                    <Col span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                    </Col>
                    <Col span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                    </Col>
                    <Col span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                    </Col>
                    <Col style={{ display: 'flex' }}>
                        <WrapperStylePolicy>
                            <Image src={icon1} alt='icon' preview={false} />
                            <WrapperStylePolicyText>100% miễn phí vận chuyển</WrapperStylePolicyText>
                        </WrapperStylePolicy>
                        <WrapperStylePolicy>
                            <Image src={icon2} alt='icon' preview={false} />
                            <WrapperStylePolicyText>Thanh toán Online an toàn</WrapperStylePolicyText>
                        </WrapperStylePolicy>
                        <WrapperStylePolicy>
                            <Image src={icon3} alt='icon' preview={false} />
                            <WrapperStylePolicyText>100% miễn phí vận chuyển</WrapperStylePolicyText>
                        </WrapperStylePolicy>
                    </Col>
                </Row>
            </Col>
            <Col span={14}>
                <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                </WrapperPriceProduct>

                <WrapperAddressProduct>
                    <span>Giao đến </span>
                    <span className='address'>{user?.address}</span> -
                    <span className='change-address'> Đổi địa chỉ</span>
                </WrapperAddressProduct>
                <br />

                {/* counter */}
                <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                    <div style={{ marginBottom: '10px' }}>Số lượng</div>
                    <WrapperQualityProduct>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                            <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                        </button>
                        <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                            <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                        </button>
                    </WrapperQualityProduct>
                </div>

                {/* Add cart */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <WrapperStyleAddToCart style={{ background: '#dfe01a' }} onClick={handleAddOrderProduct}>
                        <span style={{ color: '#24414f' }}>
                            Thêm vào giỏ hàng
                        </span>
                    </WrapperStyleAddToCart> <br />
                    <WrapperStyleAddToCart style={{ background: '#103152' }}>
                        <span style={{ color: "#fff" }}>
                            Mua Ngay
                        </span>
                    </WrapperStyleAddToCart>
                    
                </div>
                {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm hết hàng</div>}
            </Col>

        </Row>

    )
}

export default ProductDetailComponent