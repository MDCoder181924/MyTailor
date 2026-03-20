import React from 'react'
import { Bell, ShoppingBag, User } from "lucide-react";

const HeaderDashbord = ({setExplorclick , setCategory}) => {

  const onClickExplore=(e)=>{
    setExplorclick(true);
    setCategory("All");
  }

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
          <p className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Collections</p>
          <p className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Artisans</p>
          <p className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Fabrics</p>
          <p 
          onClick={onClickExplore}
          className="hover:text-yellow-400 text-[1.1rem] cursor-pointer">Explore</p>
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
