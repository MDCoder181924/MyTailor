import React from "react";

const Section3 = () => {
  return (
    <div className="h-screen bg-black text-white flex flex-col justify-center px-6 md:px-16">

      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">
          The Journey to Perfection
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Seamlessly bridge the gap between digital convenience and traditional craftsmanship.
        </p>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* Left Side */}
        <div>
          <h3 className="text-yellow-400 text-xl font-semibold mb-6 border-b border-yellow-400 pb-2">
            For the Modern Individual
          </h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-yellow-400 rounded-full text-yellow-400">
                1
              </div>
              <div>
                <h4 className="font-semibold">Register & Profile</h4>
                <p className="text-gray-400 text-sm">
                  Create your account and save your style preferences and delivery details.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-yellow-400 rounded-full text-yellow-400">
                2
              </div>
              <div>
                <h4 className="font-semibold">Browse Artisans</h4>
                <p className="text-gray-400 text-sm">
                  Explore portfolios of verified tailors globally and pick the perfect match.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-yellow-400 rounded-full text-yellow-400">
                3
              </div>
              <div>
                <h4 className="font-semibold">Place Your Order</h4>
                <p className="text-gray-400 text-sm">
                  Submit your measurements, choose fabrics, and receive your garment at your door.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div>
          <h3 className="text-yellow-400 text-xl font-semibold mb-6 border-b border-yellow-400 pb-2">
            For the Master Craftsman
          </h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-500 rounded-full text-gray-300">
                1
              </div>
              <div>
                <h4 className="font-semibold">Artisan Verification</h4>
                <p className="text-gray-400 text-sm">
                  Apply to join our exclusive network of professional tailors and pattern makers.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-500 rounded-full text-gray-300">
                2
              </div>
              <div>
                <h4 className="font-semibold">Showcase Work</h4>
                <p className="text-gray-400 text-sm">
                  Upload your portfolio and enable garment styles to attract premium clients.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-500 rounded-full text-gray-300">
                3
              </div>
              <div>
                <h4 className="font-semibold">Manage & Earn</h4>
                <p className="text-gray-400 text-sm">
                  Handle commissions through our secure dashboard and grow your global business.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Section3;