export default function OrdersTable() {
  const orders = [
    {
      id: "#ORD-8821",
      date: "Oct 12, 2023",
      name: "Julian Voss",
      product: "Bespoke Three-Piece Suit",
      desc: "Super 150s Merino Wool • Charcoal Herringbone",
      status: "IN PROGRESS",
      total: "$3,450.00",
    },
    {
      id: "#ORD-8794",
      date: "Oct 10, 2023",
      name: "Evelyn Dubois",
      product: "Silk Charmeuse Blouse",
      desc: "Hand-stitched Italian Silk • Midnight Azure",
      status: "PENDING",
      total: "$820.00",
    },
    {
      id: "#ORD-8755",
      date: "Oct 05, 2023",
      name: "Marcus Thorne",
      product: "Evening Tuxedo",
      desc: "Velvet Lapels • Silk Lining • Jet Black",
      status: "SHIPPED",
      total: "$4,200.00",
    },
    {
      id: "#ORD-8711",
      date: "Sep 28, 2023",
      name: "Helena Rossi",
      product: "Bespoke Silk Gown",
      desc: "Lace Embroidery • Hand-dyed Silk",
      status: "IN PROGRESS",
      total: "$5,800.00",
    },
  ];

  return (
    <div className="bg-black text-white p-6">

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search orders, clients or fabrics..."
          className="bg-gray-900 px-4 py-2 rounded-lg w-full md:w-1/3 outline-none"
        />

        {/* Filters */}
        <div className="flex gap-3">
          <button className="bg-gray-900 px-4 py-2 rounded-lg text-sm">
            STATUS: ALL
          </button>
          <button className="bg-gray-900 px-4 py-2 rounded-lg text-sm">
            DATE RANGE
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-5 px-6 py-4 text-gray-400 text-sm border-b border-gray-800">
          <span>ORDER ID</span>
          <span>CLIENT</span>
          <span>PRODUCT DETAILS</span>
          <span>STATUS</span>
          <span className="text-right">TOTAL</span>
        </div>

        {/* Rows */}
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-5 px-6 py-5 border-b border-gray-800 items-center"
          >
            {/* ID */}
            <div>
              <p className="text-yellow-400 font-semibold">{order.id}</p>
              <p className="text-xs text-gray-500">{order.date}</p>
            </div>

            {/* Client */}
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                className="w-8 h-8 rounded-full"
              />
              <span>{order.name}</span>
            </div>

            {/* Product */}
            <div>
              <p className="font-medium">{order.product}</p>
              <p className="text-xs text-gray-400">{order.desc}</p>
            </div>

            {/* Status */}
            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  order.status === "SHIPPED"
                    ? "bg-green-600"
                    : order.status === "PENDING"
                    ? "bg-yellow-600"
                    : "bg-yellow-400 text-black"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Total */}
            <div className="text-right text-yellow-400 font-semibold">
              {order.total}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between text-sm text-gray-400 mt-4">
        <p>Showing 1-10 of 124 orders</p>
        <div className="flex gap-4">
          <button>Previous Page</button>
          <button>Next Page</button>
        </div>
      </div>

    </div>
  );
}