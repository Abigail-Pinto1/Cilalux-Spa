import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router'
import Footer from '../Components/Footer'
import ScrollToTop from './ScrollToTop'

const RootLayout = () => {
  return (
    <div> 
      <ScrollToTop/>
        <Navbar/>
        <main>
        <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default RootLayout