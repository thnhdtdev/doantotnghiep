
import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import HeaderComponent from './components/HeaderComponent/HeaderComponent'
import FooterComponent from './components/FooterComponent/FooterComponent'
import { isJsonString } from './until'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import * as UserService from './service/UserService'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'


export function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData)
    }
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  }


  return (
    <div>
      <Router>
        <HeaderComponent />
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const isCheckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={isCheckAuth ? route.path : undefined} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
        {/* <FooterComponent /> */}
      </Router>
    </div>
  )
}

export default App