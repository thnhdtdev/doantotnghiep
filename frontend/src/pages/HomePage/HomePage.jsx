import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from './style'
import { Link } from 'react-router-dom'
import SlideComponent from '../../components/SlideComponent/SlideComponent'
import slider1 from '../../assets/images/slide_1.png'
import slider2 from '../../assets/images/slide_2.png'
import slider3 from '../../assets/images/slide_3.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../service/ProductService'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)

  const [limit, setLimit] = useState(6)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const { data: product, } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductAll,
    retry: 3, retryDelay: 1000
  })

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }

  const { data: products, isPreviousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });


  useEffect(() => {
    fetchAllTypeProduct()
  }, [])


  return (
    <div style={{ padding: "0 120px", }}>
      <WrapperTypeProduct style={{ background: '#224F71', color: 'white' }}>
        {typeProducts.map((item) => {
          return (
            <TypeProduct name={item} key={item} />
          )
        })}
      </WrapperTypeProduct>
      <div id='container' style={{ width: '100%', height: '1000px', paddingTop: '10px' }}>
        <SlideComponent arrImages={[slider1, slider2, slider3]} />
        <WrapperProduct>
          {product?.data?.map((product) => {
            return (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                type={product.type}
                id={product._id}
              />
            )
          })}

        </WrapperProduct>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
          <WrapperButtonMore 
          type="outline" 
          textButton="Xem Thêm" 
          onClick={() => setLimit((prev) => prev + 6)}/>
        </div>

      </div>
    </div>
  )
}


export default HomePage