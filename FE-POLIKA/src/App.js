import React from 'react'
import Register from './pages/Register'
// import Slide from './share/components/Slide'
// import Servies from './share/components/Servies'
// import InfoOder from './share/components/InfoOder'
// import HeaderListOrder from './share/components/HeaderListOrder'
// import BanerCenter from './share/components/BanerCenter'
// import Product from './share/components/Product'
// import News from './share/components/News'
// import Footer from './share/components/Layout/Footer'
// import Header from './share/components/Layout/Header'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ProductDetail from './pages/ProductDetail'
import ShoppingCart from './pages/Cart'
import Dashboard from './pages/Dashboard/Dashboard'
import GetAllUserDashBoard from './pages/Dashboard/getAllUser'
import UserDetail from './pages/Dashboard/userDetail'
import LoginDashboard from './pages/Dashboard/loginDashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Orders from './pages/ListOrders'



const App = () => {
  return (
   <BrowserRouter>
      {/* <Layout> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/login"  element={<Login/>}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<GetAllUserDashBoard/>} />
          <Route path="/admin-login" element={<LoginDashboard/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/list-Orders" element={<Orders />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path='/product-details/' element= {<ProductDetail/>} />
          <Route path='/cart' element= {<ShoppingCart/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/:userId" element={ <UserDetail/>} />
          <Route path="/Don-Hang/:id"  />
        </Routes>
      {/* </Layout> */}
    </BrowserRouter>  
  )
}

export default App