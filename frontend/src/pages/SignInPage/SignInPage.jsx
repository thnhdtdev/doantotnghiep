import React, { useEffect, useState } from 'react'
import { WrapperButton, WrapperLinkButton, WrapperLoginContainer } from './style';
import { useLocation, useNavigate } from 'react-router-dom';
import InputForm from '../../components/InputForm/InputForm';
import * as UserService from '../../service/UserService'
import { useMutationHook } from '../../hooks/useMutationHook';
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide';

const SignInPage = () => {
    const navigate = useNavigate()
    const location = useLocation()


    const mutation = useMutationHook(
        data => UserService.loginUser(data)
    )

    const dispatch = useDispatch();


    const { data, isSuccess, isError } = mutation
    useEffect(() => {
        if (isSuccess) {
            if (location?.state) {
                navigate(location?.state)
            } else {
                navigate('/')
            }

            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token)
                console.log('decoded', decoded)
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.access_token)
                }
            }
        }
    }, [isSuccess])

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic đăng nhập ở đây
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <WrapperLoginContainer style={{ marginTop: '70px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng Nhập</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="email">Email:</label>
                    <InputForm
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleOnChangeEmail}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }} htmlFor="password">Mật khẩu:</label>
                    <InputForm
                        type="password"
                        id="password"
                        value={password}
                        onChange={handleOnChangePassword}
                        required
                    />
                </div>
                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                <WrapperButton onClick={handleSignIn} type="submit">Đăng Nhập</WrapperButton>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <WrapperLinkButton >
                        Quên mật khẩu?
                    </WrapperLinkButton>
                    <WrapperLinkButton onClick={handleNavigateSignUp} >
                        Đăng ký
                    </WrapperLinkButton>
                </div>
            </form>
        </WrapperLoginContainer>
    );
}

export default SignInPage