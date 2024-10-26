import React from 'react'

import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonSearch = (props) => {
    const { size, placeholder, textButton } = props
    return (
        <div style={{ display: 'flex' }}>
            <InputComponent size={size} placeholder={placeholder} style={{ backgroundColor: "#fff" }} {...props}/>
            <ButtonComponent size={size} icon={<SearchOutlined />} textButton={textButton} />
        </div>
    )
}

export default ButtonSearch