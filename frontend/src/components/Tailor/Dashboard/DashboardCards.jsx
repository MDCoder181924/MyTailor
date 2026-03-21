export default function DashboardCards() {
  return (
    <div className="bg-black p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">

      {/* Card 1 */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg relative">
        <p className="text-gray-400 text-xs mb-2">TOTAL REVENUE</p>

        <span className="absolute top-4 right-4 bg-green-600 text-xs px-2 py-1 rounded-full">
          +12.5%
        </span>

        <h2 className="text-yellow-400 text-3xl font-bold mt-2">
          $12,450.00
        </h2>

        <div className="h-1 bg-yellow-400 w-24 mt-4"></div>
      </div>

      {/* Card 2 */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <p className="text-gray-400 text-xs mb-2">ACTIVE ORDERS</p>

        <h2 className="text-3xl font-bold">
          24 <span className="text-sm text-gray-400">Pending tailoring</span>
        </h2>

        {/* Avatars */}
        <div className="flex items-center mt-4">
          <img src="https://i.pravatar.cc/30?img=1" className="w-7 h-7 rounded-full border-2 border-black" />
          <img src="https://i.pravatar.cc/30?img=2" className="w-7 h-7 rounded-full border-2 border-black -ml-2" />
          <img src="https://i.pravatar.cc/30?img=3" className="w-7 h-7 rounded-full border-2 border-black -ml-2" />
          
          <div className="w-7 h-7 flex items-center justify-center text-xs bg-gray-700 rounded-full -ml-2">
            +12
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden">

        <p className="text-yellow-400 text-xs mb-2">TOP PRODUCT</p>

        <h2 className="text-2xl font-serif font-bold">
          Bespoke Suit
        </h2>

        <p className="text-sm text-gray-300 mt-1">
          Signature Silk Blend
        </p>

        <p className="text-yellow-400 text-sm mt-4">
          ⭐ PREMIUM PICK
        </p>

        {/* Background Icon */}
        <div className="absolute right-4 bottom-2 text-gray-500 text-7xl opacity-20">
          🧥
        </div>

      </div>

    </div>
  );
}