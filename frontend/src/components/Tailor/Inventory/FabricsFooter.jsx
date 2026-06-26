export default function FabricsFooter() {
  return (
    <div className="bg-theme-bg text-theme-text px-8 py-4 flex flex-col md:flex-row justify-between items-center border-t border-theme-border gap-4">

      {/* Left Stats */}
      <div className="flex gap-10">

        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">LIVE INVENTORY</p>
          <p className="text-theme-accent text-xl font-bold">
            Tailor product catalog
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">VISIBLE PRODUCTS</p>
          <p className="text-lg font-semibold text-theme-text">Auto synced</p>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">ORDER READY</p>
          <p className="text-emerald-500 dark:text-emerald-400 text-lg font-semibold">Yes</p>
        </div>

      </div>
    </div>
  );
}
