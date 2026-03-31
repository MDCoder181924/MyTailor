import { useContext } from "react";
import { Link } from "react-router-dom";
import defaultTailorImage from "../../../assets/images/by-defalt-tailor-img.avif";
import { AuthContext } from "../../../context/AuthContext";

export default function TailorProfilePhoto() {
  const { tailor } = useContext(AuthContext);

  const profilePhoto = tailor?.profilePhoto || defaultTailorImage;
  const title = tailor?.professionalTitle || "MASTER TAILOR & DESIGNER";
  const years = Number.isFinite(Number(tailor?.yearsOfExperience)) ? Number(tailor.yearsOfExperience) : 0;

  return (
    <div className="bg-black text-white p-8 flex flex-col lg:flex-row items-center gap-10">
      <div className="relative">
        <img
          src={profilePhoto}
          alt={tailor?.tailorName || "Tailor"}
          className="w-[300px] h-[400px] object-cover rounded-lg"
        />

        <span className="absolute bottom-3 left-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded">
          {tailor?.shopName || "MY TAILOR"}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              {tailor?.tailorName || "My Tailor"}
            </h1>

            <p className="text-yellow-400 mt-3 italic">
              {title}
            </p>
          </div>

          <Link to="/TailorSettings" className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
            Edit Profile
          </Link>
        </div>

        <div className="flex gap-10 mt-10 border-t border-gray-800 pt-6 flex-wrap">
          <div>
            <p className="text-yellow-400 text-xl font-bold">{years}+</p>
            <p className="text-xs text-gray-400">YEARS EXPERIENCE</p>
          </div>

          <div>
            <p className="text-yellow-400 text-xl font-bold">{tailor?.specializations?.length || 0}</p>
            <p className="text-xs text-gray-400">SPECIALIZATIONS</p>
          </div>

          <div>
            <p className="text-yellow-400 text-xl font-bold">{tailor?.keySkills?.length || 0}</p>
            <p className="text-xs text-gray-400">KEY SKILLS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
