import React from "react";
import bgImg from "../../assets/images/Home/home4SectionBg.png"; // 2nd photo

const Section4 = () => {
  return (
    <div className="md:h-screen w-full relative overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      {/* Dark Overlay (left thi right fade) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

      {/* Content (RIGHT SIDE) */}
      <div className="relative z-10 h-full flex items-center justify-end px-6 md:px-16">

        <div className="max-w-xl text-white">

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Unrivaled Precision. <br />
            Custom Fit.
          </h2>

          <p className="mt-5 text-gray-300">
            Our advanced measurement profile allows you to store detailed body metrics
            and specific delivery addresses. Whether it's a tapered waist or a specific sleeve length,
            your tailor receives every detail to ensure a second-skin fit.
          </p>

          {/* Points */}
          <div className="mt-6 space-y-3">
            <p className="flex items-center gap-2">
              <span className="text-yellow-400">✔</span> 3D Body Profile Mapping
            </p>
            <p className="flex items-center gap-2">
              <span className="text-yellow-400">✔</span> Fabric Sensitivity Selection
            </p>
            <p className="flex items-center gap-2">
              <span className="text-yellow-400">✔</span> Worldwide Doorstep Delivery
            </p>
          </div>

          {/* Link */}
          <p className="mt-6 text-yellow-400 cursor-pointer hover:underline">
            Setup Your Profile →
          </p>

        </div>
      </div>

    </div>
  );
};

export default Section4;