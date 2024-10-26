import React, { useEffect, useState } from 'react'
import { WrapperHeader } from '../../components/HeaderComponent/styled'
import { WrapperContentProfile, WrapperInput, WrapperLabel } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import { message } from 'antd'


const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutationHook(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)

        }
    )

    const dispatch = useDispatch()
    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(UserService.updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnchangeAvatar = (value) => {
        setAddress(value)
    }

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
    }
    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <WrapperContentProfile>
                <WrapperInput>
                    <WrapperLabel>Name</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Update'}
                    // styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel>Email</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="name" value={email} onChange={handleOnchangeEmail} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Update'}
                    // styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel>Phone</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="name" value={phone} onChange={handleOnchangePhone} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Update'}
                    // styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel>Address</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="name" value={address} onChange={handleOnchangeAddress} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Update'}
                    // styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>

            </WrapperContentProfile>


        </div>
    )
}

export default ProfilePage
