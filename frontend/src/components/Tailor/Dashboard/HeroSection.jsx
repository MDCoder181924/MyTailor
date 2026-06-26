import { useContext } from "react";
import { Calendar } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

function HeroSection() {
  const { tailor } = useContext(AuthContext);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between bg-theme-bg px-8 py-10 text-theme-text">
      <div>
        <h1 className="text-4xl font-serif font-bold leading-tight md:text-5xl">
          Welcome Back,
          <br />
          {tailor?.tailorName || "Tailor"}
        </h1>
        <p className="mt-3 text-sm font-bold tracking-[0.2em] text-theme-accent">
          {tailor?.shopName || "MYTAILOR STUDIO"}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-theme-panel px-5 py-3 shadow-lg border border-theme-border">
        <div className="rounded-md bg-yellow-400 text-black p-2">
          <Calendar size={18} />
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">CURRENT SESSION</p>
          <p className="text-sm font-semibold">{currentDate}</p>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
