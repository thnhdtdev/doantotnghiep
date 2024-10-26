import React, { useEffect, useState } from 'react'
import { WrapperButton, WrapperLinkButton, WrapperLoginContainer } from './style';
import { useNavigate } from 'react-router-dom';
import InputForm from '../../components/InputForm/InputForm';
import * as UserService from '../../service/UserService'
import { useMutationHook } from '../../hooks/useMutationHook';
import * as message from '../../components/MessageComponent/Message'


const SignUpPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const navigate = useNavigate()

  const mutation = useMutationHook(
    data => UserService.signupUser(data)
  )

  const { data, isSuccess, isError } = mutation

  //Thông báo khi event thành công hoặc thất bại
  useEffect(() => {
    if (isSuccess) {
      message.success()
      // handleNavigateSignIn()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  //Quay lại trang đăng nhập
  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword })
  }



  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnChangePassword = (value) => {
    setPassword(value)
  }
  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }


  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

  };
  return (
    <WrapperLoginContainer style={{ marginTop: '70px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng Ký</h2>
      <form onSubmit={handleRegister}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ width: '100px', marginBottom: 0 }} htmlFor="email">Email:</label>
          <InputForm
            type="email"
            id="email"
            value={email}
            onChange={handleOnChangeEmail}
            required
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ width: '100px', marginBottom: 0 }} htmlFor="password">Mật khẩu:</label>
          <InputForm
            type="password"
            id="password"
            value={password}
            onChange={handleOnChangePassword}
            required
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ width: '100px', marginBottom: 0 }} htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
          <InputForm
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleOnChangeConfirmPassword}
            required
          />
        </div>

        {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
        <WrapperButton onClick={handleSignUp} type="submit">Đăng Ký</WrapperButton>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', textDecoration: 'none' }}>
          <WrapperLinkButton onClick={handleNavigateSignIn} className="link-button">
            Quay lại đăng nhập
          </WrapperLinkButton>
        </div>
      </form>
    </WrapperLoginContainer>
  )
}

export default SignUpPage