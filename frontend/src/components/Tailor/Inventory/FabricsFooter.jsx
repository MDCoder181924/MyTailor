import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FabricsFooter() {
  return (
    <div className="bg-black text-white px-8 py-4 flex flex-col md:flex-row justify-between items-center border-t border-gray-800 gap-4">

      {/* Left Stats */}
      <div className="flex gap-10">

        <div>
          <p className="text-xs text-gray-400">TOTAL VALUE</p>
          <p className="text-yellow-400 text-xl font-bold">
            $142,450.00
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">UNIQUE MATERIALS</p>
          <p className="text-lg font-semibold">124</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">RESTOCK NEEDED</p>
          <p className="text-red-400 text-lg font-semibold">12</p>
        </div>

      </div>

      {/* Right Pagination */}
      <div className="flex items-center gap-4">

        <p className="text-xs text-gray-400">
          PAGE 1 OF 12
        </p>

        <div className="flex gap-2">

          <button className="bg-gray-900 p-2 rounded-lg hover:bg-gray-800">
            <ChevronLeft size={18} />
          </button>

          <button className="bg-gray-900 p-2 rounded-lg hover:bg-gray-800">
            <ChevronRight size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}