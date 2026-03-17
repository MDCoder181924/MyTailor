import React from 'react'
import fastImg from "../../assets/images/Home/fasetSectionBg.png";

const Section1 = () => {
  return (
    <div>
      <div className="h-[calc(100vh-5rem)] w-full relative">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fastImg})` }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

        <div className="relative z-10 flex items-center h-full px-10 md:px-20">
          <div className="max-w-xl text-white">

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              The Art of <br /><span className="text-yellow-400">Precision Fit.</span>
            </h1>

            <p className="mt-5 text-gray-300 text-lg">
              Experience the luxury of bespoke tailoring from the comfort of your home.
              Connect with master craftsmen to create garments that define your unique silhouette.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-yellow-400 hover:bg-black hover:text-white hover:border-2 hover:border-amber-100 text-black px-6 py-3 font-semibold rounded">
                START YOUR ORDER
              </button>

              <button className="border hover:bg-yellow-400 hover:border-black hover:text-black border-white px-6 py-3 rounded">
                VIEW PORTFOLIO
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Section1
