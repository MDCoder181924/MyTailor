export default function OrdersCards() {
  return (
    <div className="bg-black  text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-serif font-bold">Orders</h1>
        <p className="text-gray-400 tracking-widest text-sm mt-2">
          AURELIAN THREAD MANAGEMENT
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="bg-gray-900 p-6 rounded-xl relative overflow-hidden shadow-lg">
          <p className="text-gray-400 text-sm">TOTAL ACTIVE ORDERS</p>

          <h2 className="text-yellow-400 text-4xl font-bold mt-4">
            42
          </h2>

          {/* Background Icon */}
          <div className="absolute right-4 bottom-2 text-gray-700 text-7xl opacity-20">
            📦
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-900 p-6 rounded-xl relative overflow-hidden shadow-lg">
          <p className="text-gray-400 text-sm">PENDING FITTINGS</p>

          <h2 className="text-yellow-300 text-4xl font-bold mt-4">
            18
          </h2>

          <div className="absolute right-4 bottom-2 text-gray-700 text-7xl opacity-20">
            👤
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-900 p-6 rounded-xl relative overflow-hidden shadow-lg">
          <p className="text-gray-400 text-sm">COMPLETED (MONTHLY)</p>

          <h2 className="text-green-400 text-4xl font-bold mt-4">
            124
          </h2>

          <div className="absolute right-4 bottom-2 text-gray-700 text-7xl opacity-20">
            ✔️
          </div>
        </div>

      </div>

    </div>
  );
}