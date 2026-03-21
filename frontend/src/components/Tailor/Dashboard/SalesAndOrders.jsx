import {LineChart,Line,XAxis,Tooltip,ResponsiveContainer,} from "recharts";

const data = [
  { day: "Mon", value: 10 },
  { day: "Tue", value: 20 },
  { day: "Wed", value: 25 },
  { day: "Thu", value: 30 },
  { day: "Fri", value: 50 },
  { day: "Sat", value: 80 },
  { day: "Sun", value: 70 },
];

function SalesAndOrders() {
  return (
    <div className="bg-black text-white p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT - Chart */}
      <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl shadow-lg">

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Weekly Sales Trends</h2>
            <p className="text-xs text-gray-400">GROWTH & ENGAGEMENT</p>
          </div>

          <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full">
            7D
          </span>
        </div>

        {/* Chart */}
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#facc15"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Stats */}
        <div className="flex justify-between mt-6 text-sm">
          <div>
            <p className="text-gray-400">Conversion</p>
            <p className="font-semibold">4.8%</p>
          </div>

          <div>
            <p className="text-gray-400">Avg Order</p>
            <p className="font-semibold">$2,400</p>
          </div>

          <div>
            <p className="text-gray-400">Retention</p>
            <p className="font-semibold">92%</p>
          </div>
        </div>
      </div>

      {/* RIGHT - Orders */}
      <div className="space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <span className="text-yellow-400 text-sm cursor-pointer">
            VIEW ALL
          </span>
        </div>

        {/* Order Card */}
        <div className="bg-gray-900 p-4 rounded-xl border-l-4 border-yellow-400">
          <div className="flex justify-between text-sm">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs">
              IN PROGRESS
            </span>
            <span>$3,200</span>
          </div>

          <h3 className="mt-2 font-semibold">Bespoke Silk Tuxedo</h3>
          <p className="text-xs text-gray-400">Customer: Julian Vane</p>
        </div>

        {/* Order Card */}
        <div className="bg-gray-900 p-4 rounded-xl border-l-4 border-green-400">
          <div className="flex justify-between text-sm">
            <span className="bg-green-400 text-black px-2 py-1 rounded text-xs">
              SHIPPED
            </span>
            <span>$1,850</span>
          </div>

          <h3 className="mt-2 font-semibold">Linen Summer Blazer</h3>
          <p className="text-xs text-gray-400">Customer: Marcus Thorne</p>
        </div>

        {/* Order Card */}
        <div className="bg-gray-900 p-4 rounded-xl border-l-4 border-yellow-400">
          <div className="flex justify-between text-sm">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs">
              IN PROGRESS
            </span>
            <span>$4,100</span>
          </div>

          <h3 className="mt-2 font-semibold">
            Wool Double Breasted Suit
          </h3>
          <p className="text-xs text-gray-400">Customer: Elena Rossi</p>
        </div>

      </div>
    </div>
  );
}

export default SalesAndOrders;