import React from 'react'

const Header = () => {
  return (
    <div>
      <div className=" md:h-20 h-45 md:flex justify-between p-5 content-center">
        <div className="  flex items-center md:justify-center mb-3 md:mb-0">
          <p className='text-3xl text-amber-400 pl-5 font-serif font-semibold'> MyTailor </p>
        </div>
        <div className=" md:flex gap-10 md:pr-7 ">
          <div className="flex md:gap-7 gap-3 mb-3 md:mb-0">
            <button className='hover:text-amber-400 text-[1.2rem]'>Explore</button>
            <button className='text-[1.2rem] hover:text-amber-400'>Tailors</button>
            <button className='text-[1.2rem] hover:text-amber-400'>How it Works About</button>
            <button className='text-[1.2rem] hover:text-amber-400'>Explore</button>
          </div>
          <div className="flex justify-center md:justify-normal">
            <button className='text-[1.3rem] bg-amber-400 text-black hover:bg-black border-amber-300  border-2 hover:border-amber-300 hover:text-white px-4 rounded-3xl'>Login/Sine Up</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
