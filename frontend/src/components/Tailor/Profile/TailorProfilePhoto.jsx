import defaultTailorImage from "../../../assets/images/by-defalt-tailor-img.avif";

export default function TailorProfilePhoto() {
  return (
    <div className="bg-black text-white p-8 flex flex-col lg:flex-row items-center gap-10">

      {/* Left - Image */}
      <div className="relative">
        <img
          src={defaultTailorImage}
          alt="artisan"
          className="w-[300px] h-[400px] object-cover rounded-lg"
        />

        {/* Badge */}
        <span className="absolute bottom-3 left-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded">
          EST. 1984
        </span>
      </div>

      {/* Right - Info */}
      <div className="flex-1">

        {/* Top */}
        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Artisan <br />
              Alessandro <br />
              Moretti
            </h1>

            <p className="text-yellow-400 mt-3 italic">
              Master Cutter & Sartorial Director
            </p>
          </div>

          {/* Edit Button */}
          <button className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
            ✏️ EDIT PROFILE
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-10 border-t border-gray-800 pt-6">

          <div>
            <p className="text-yellow-400 text-xl font-bold">40+</p>
            <p className="text-xs text-gray-400">YEARS EXPERIENCE</p>
          </div>

          <div>
            <p className="text-yellow-400 text-xl font-bold">2.5k+</p>
            <p className="text-xs text-gray-400">COMMISSIONS</p>
          </div>

          <div>
            <p className="text-yellow-400 text-xl font-bold">4.9 ★</p>
            <p className="text-xs text-gray-400">CLIENT RATING</p>
          </div>

        </div>

      </div>
    </div>
  );
}
