import React from 'react'
import AddProductForm from "../../components/Tailor/AddProduct/AddProductForm"
import Header from "../../components/Tailor/header"
import TailorPhoneFooter from "../../components/Tailor/TailorPhoneFooter"

const AddProduct = () => {
  return (
    <div className="bg-theme-bg min-h-screen pb-24 w-full transition-colors duration-300">
      <Header/>
      <AddProductForm/>
      <TailorPhoneFooter/>
    </div>
  )
}

export default AddProduct
