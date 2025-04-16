import React from 'react';
import Slide from '../share/components/Slide';
import Servies from '../share/components/Servies';
import BanerCenter from '../share/components/BanerCenter';
import Product from '../share/components/Product';
import News from '../share/components/News';
// import HeaderListOrder from '../share/components/HeaderListOrder';
import Header from '../share/components/Layout/Header'
import Footer from '../share/components/Layout/Footer';
import BottomNav from '../share/components/BottomNav';
import ListOrdersHome from './ListOrders-Home';

const Home = () => {
  return (
    <>
    <Header/>
    <Slide />
    <Servies />
    {/* <HeaderListOrder/> */}
    <ListOrdersHome /> 
      <BanerCenter />
      <Product />
      <News />
      <BottomNav/>
      <Footer/>
    </>
  );
};

export default Home;