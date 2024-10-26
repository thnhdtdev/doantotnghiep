import { Image } from 'antd';
import React from 'react'
import Slider from "react-slick";

const SlideComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed:2000,
    };
    return (
        <Slider {...settings}>
            {arrImages.map((image) => {
                return (
                    <Image key={image} src={image} alt='slider' preview={false} />
                )
            })}
        </Slider>
    )
}

export default SlideComponent