import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function HeritageSection() {
  const { tailor } = useContext(AuthContext);

  const specializations = tailor?.specializations?.length
    ? tailor.specializations
    : ["Bespoke Suits", "Wedding Attire", "Alterations"];

  const description =
    tailor?.shopDescription ||
    "Add your shop description from settings to tell customers about your tailoring style, expertise, and services.";

  return (
    <div className="bg-black text-white p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <p className="text-yellow-400 text-xs tracking-widest mb-4">
          HERITAGE & PHILOSOPHY
        </p>

        <p className="italic text-yellow-200 text-lg leading-relaxed mb-6">
          "{tailor?.professionalTitle || "MASTER TAILOR & DESIGNER"}"
        </p>

        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <p className="text-gray-400 text-xs mb-4">
          TECHNICAL EXPERTISE
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {specializations.map((item) => (
            <span
              key={item}
              className="border border-yellow-400 text-yellow-400 text-xs px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="bg-black p-4 rounded-lg border-l-4 border-yellow-400">
          <p className="text-xs text-gray-400 mb-1">SHOP ADDRESS</p>
          <p className="text-sm">
            {tailor?.shopAddress || "Add your shop address from settings."}
          </p>
        </div>
      </div>
    </div>
  );
}
