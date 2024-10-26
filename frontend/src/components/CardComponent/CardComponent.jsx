import { Card } from 'antd'
import React from 'react'
import { WrapperNameProduct, WrapperPrice } from './style'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../until'

const CardComponent = (props) => {
    const { image, name, price, id } = props

    const navigate = useNavigate()
    const handleDetailProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() =>  handleDetailProduct(id)}        >

            <WrapperNameProduct>{name}</WrapperNameProduct>
            <WrapperPrice>
                <span>{convertPrice(price)}</span>
                </WrapperPrice>
        </Card>
    )
}

export default CardComponent