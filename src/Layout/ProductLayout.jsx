import React from 'react'
import Header from '../Products/productCompo/Header.jsx'
import { Outlet } from 'react-router'
import ProFooter from '../Products/productCompo/ProFooter.jsx'

const ProductLayout = () => {
  return (
    <div>
       
        <Outlet/>
    </div>
  )
}

export default ProductLayout