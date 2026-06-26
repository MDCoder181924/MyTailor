import React from 'react'
import AddProductForm from "../../components/Tailor/AddProduct/AddProductForm"
import Header from "../../components/Tailor/header"

const AddProduct = () => {
  return (
    <div className="bg-theme-bg min-h-screen pb-12 w-full transition-colors duration-300">
      <Header/>
      <AddProductForm/>
    </div>
  )
}

export default AddProduct
