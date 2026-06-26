import React from "react";
import { Link } from "react-router-dom";
import bgImg from "../../assets/images/Home/home4SectionBg.png";

const Section4 = () => {
  return (
    <div className="min-h-screen md:h-screen w-full relative overflow-hidden flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      {/* Dark Overlay (legible on mobile, right-to-left fade on desktop) */}
      <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-l md:from-black md:via-black/80 md:to-transparent"></div>

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column (Empty to let background show on desktop) */}
          <div className="hidden md:block" />

          {/* Right Column: Content */}
          <div className="max-w-xl text-white keep-white space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight font-serif">
              Unrivaled Precision. <br />
              <span className="text-yellow-400">Custom Fit.</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Our advanced measurement profile allows you to store detailed body metrics
              and specific delivery addresses. Whether it's a tapered waist or a specific sleeve length,
              your tailor receives every detail to ensure a second-skin fit.
            </p>

            {/* Points */}
            <div className="space-y-3 pt-2">
              <p className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-yellow-400 font-bold text-lg">✔</span> 3D Body Profile Mapping
              </p>
              <p className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-yellow-400 font-bold text-lg">✔</span> Fabric Sensitivity Selection
              </p>
              <p className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-yellow-400 font-bold text-lg">✔</span> Worldwide Doorstep Delivery
              </p>
            </div>

            {/* Link */}
            <div className="pt-4">
              <Link to="/auth" className="inline-block text-yellow-400 font-bold hover:underline tracking-wide uppercase text-sm">
                Setup Your Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section4;