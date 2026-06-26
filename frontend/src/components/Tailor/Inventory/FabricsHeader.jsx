import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function FabricsHeader() {
  return (
    <div className="bg-theme-bg text-theme-text px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

      {/* Left Side */}
      <div>
        <p className="text-theme-accent text-xs font-bold tracking-[0.18em] mb-2 uppercase">
          CURRENT SELECTION
        </p>

        <h1 className="text-4xl md:text-5xl font-serif font-bold">
          Your Products
        </h1>
      </div>

      {/* Right Side Buttons */}
      <div className="flex gap-3">

        {/* Filter Button */}
        <button className="flex items-center gap-2 bg-theme-panel border border-theme-border px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent-muted transition-colors uppercase">
          <SlidersHorizontal size={14} />
          FILTER BY CATEGORY
        </button>

        {/* Sort Button */}
        <button className="flex items-center gap-2 bg-theme-panel border border-theme-border px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent-muted transition-colors uppercase">
          <ArrowUpDown size={14} />
          SORT BY STOCK
        </button>

      </div>
    </div>
  );
}
