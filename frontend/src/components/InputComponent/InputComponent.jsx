import React from 'react'
import { Input } from 'antd'

const InputComponent = ({ size, placeholder, style}) => {
    return (
        <Input size={size} placeholder={placeholder} style={style} />
    )
}

export default InputComponent