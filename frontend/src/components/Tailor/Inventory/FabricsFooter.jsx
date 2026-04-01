export default function FabricsFooter() {
  return (
    <div className="bg-black text-white px-8 py-4 flex flex-col md:flex-row justify-between items-center border-t border-gray-800 gap-4">

      {/* Left Stats */}
      <div className="flex gap-10">

        <div>
          <p className="text-xs text-gray-400">LIVE INVENTORY</p>
          <p className="text-yellow-400 text-xl font-bold">
            Tailor product catalog
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">VISIBLE PRODUCTS</p>
          <p className="text-lg font-semibold">Auto synced</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">ORDER READY</p>
          <p className="text-green-400 text-lg font-semibold">Yes</p>
        </div>

      </div>
    </div>
  );
}
