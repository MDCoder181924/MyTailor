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
    <div className="flex items-center justify-between bg-black px-8 py-10 text-white">
      <div>
        <h1 className="text-4xl font-serif font-bold leading-tight md:text-5xl">
          Welcome Back,
          <br />
          {tailor?.tailorName || "Tailor"}
        </h1>
        <p className="mt-3 text-sm tracking-[0.2em] text-yellow-400">
          {tailor?.shopName || "MYTAILOR STUDIO"}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-gray-900 px-5 py-3 shadow-lg">
        <div className="rounded-md bg-yellow-400 p-2 text-black">
          <Calendar size={18} />
        </div>

        <div>
          <p className="text-xs text-gray-400">CURRENT SESSION</p>
          <p className="text-sm font-semibold">{currentDate}</p>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
