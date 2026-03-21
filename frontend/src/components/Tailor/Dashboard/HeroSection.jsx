import { Calendar } from "lucide-react";

function HeroSection() {

  // Dynamic Current Date
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-black text-white px-8 py-10 flex justify-between items-center">

      {/* Left Side */}
      <div>
        {/* <p className="text-yellow-400 text-xs tracking-widest mb-3">
          AURELIAN THREAD STUDIO
        </p> */}

        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
          Welcome Back, <br />
          Mohit Dobariya
        </h1>
      </div>

      {/* Right Side (Date Card) */}
      <div className="bg-gray-900 px-5 py-3 rounded-lg flex items-center gap-3 shadow-lg">

        {/* Icon */}
        <div className="bg-yellow-400 text-black p-2 rounded-md">
          <Calendar size={18} />
        </div>

        {/* Date Info */}
        <div>
          <p className="text-xs text-gray-400">CURRENT SESSION</p>

          <p className="text-sm font-semibold">
            {currentDate}
          </p>
        </div>

      </div>
    </div>
  );
}

export default HeroSection;