import React from 'react'
import { Bell, ShoppingBag, User } from "lucide-react";
import { Link , useNavigate } from 'react-router-dom';

const HeaderDashbord = () => {

  return (
    <div>
      <div className="w-full text-white h-18 px-6 py-4 flex items-center justify-between">
        
        <div className="">
        <h1 className="text-yellow-400 text-3xl font-serif font-bold">
          MyTailor
        </h1>
        </div>

        <div className=" flex justify-between gap-20 ">
        <div className="hidden md:flex gap-10 text-sm font-medium">
          <Link to='/deshboard' className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Collections</Link>
          <Link to='/Artisans' className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Artisans</Link>
          <Link to='/OrderList' className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Order</Link>
          <Link to='/explore' className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Explore</Link>
          
        </div>

        <div className="flex items-center gap-5 mr-3" >
          <Bell className="cursor-pointer hover:text-yellow-400" size={20} />
          <ShoppingBag className="cursor-pointer hover:text-yellow-400" size={20} />
          <User className="  cursor-pointer hover:text-yellow-400" size={20} />
        </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderDashbord
