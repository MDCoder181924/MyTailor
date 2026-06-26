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
    <div className="bg-theme-bg text-theme-text p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-theme-border">
      <div>
        <p className="text-theme-accent text-xs tracking-[0.18em] font-bold mb-4 font-serif">
          HERITAGE & PHILOSOPHY
        </p>

        <p className="font-serif italic text-theme-text/90 text-lg leading-relaxed mb-6 pl-4 border-l-2 border-theme-accent/30">
          "{tailor?.professionalTitle || "MASTER TAILOR & DESIGNER"}"
        </p>

        <p className="text-theme-text-muted leading-relaxed font-light">
          {description}
        </p>
      </div>

      <div className="bg-theme-panel p-6 rounded-xl shadow-lg border border-theme-border">
        <p className="text-theme-text-muted text-[10px] font-bold tracking-[0.18em] uppercase mb-4">
          TECHNICAL EXPERTISE
        </p>

        <div className="flex flex-wrap gap-2.5 mb-6">
          {specializations.map((item) => (
            <span
              key={item}
              className="border border-theme-accent/20 bg-theme-accent-muted text-theme-accent text-xs px-3.5 py-1 rounded-full font-medium"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="bg-theme-bg p-4 rounded-lg border-l-4 border-theme-accent border border-theme-border/50">
          <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-theme-text-muted mb-1">SHOP ADDRESS</p>
          <p className="text-sm font-light text-theme-text-muted leading-relaxed">
            {tailor?.shopAddress || "Add your shop address from settings."}
          </p>
        </div>
      </div>
    </div>
  );
}
