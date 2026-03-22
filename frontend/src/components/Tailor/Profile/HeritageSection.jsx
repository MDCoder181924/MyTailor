export default function HeritageSection() {
  return (
    <div className="bg-black text-white p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* LEFT SIDE */}
      <div>

        {/* Title */}
        <p className="text-yellow-400 text-xs tracking-widest mb-4">
          HERITAGE & PHILOSOPHY
        </p>

        {/* Quote */}
        <p className="italic text-yellow-200 text-lg leading-relaxed mb-6">
          "The suit is not merely a garment; it is a secondary skin, a silent
          manifesto of a man's character. For over three decades, I have listened
          to the whispers of fabric and the geometry of the human form."
        </p>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed">
          Alessandro Moretti began his journey in the sun-drenched ateliers of
          Naples, apprenticing under the legendary Carceni family. His approach
          combines the rigorous structural demands of traditional pattern
          drafting with a modern sensibility for drape and movement. Each
          commission at Aurelian Thread undergoes a minimum of three fittings,
          ensuring a silhouette that is as effortless as it is commanding.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">

        {/* Title */}
        <p className="text-gray-400 text-xs mb-4">
          TECHNICAL EXPERTISE
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            "BESPOKE SUITS",
            "SILK DRAPERY",
            "PATTERN DRAFTING",
            "HAND-STITCHED LAPELS",
            "VICUNA WOOL",
          ].map((item, i) => (
            <span
              key={i}
              className="border border-yellow-400 text-yellow-400 text-xs px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Availability Box */}
        <div className="bg-black p-4 rounded-lg border-l-4 border-yellow-400">
          <p className="text-xs text-gray-400 mb-1">AVAILABILITY</p>
          <p className="text-sm">
            Currently accepting commissions for Winter 2024
          </p>
        </div>

      </div>

    </div>
  );
}