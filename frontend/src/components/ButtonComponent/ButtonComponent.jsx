import React from 'react'
import { Button } from 'antd'

const ButtonComponent = ({ size, textButton, styleButton,...rests }) => {
    return (
        <Button size={size} {...rests}>
            <span>{textButton}</span>
        </Button>
    )
}

export default ButtonComponent