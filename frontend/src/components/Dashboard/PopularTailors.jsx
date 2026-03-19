import React from "react";

const tailors = [
    {
        id: 1,
        name: "Mohit Dobariya",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80",
    },
    {
        id: 2,
        name: "Param sonani",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
    },
    {
        id: 3,
        name: "Ayus paldiya",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    },
    {
        id: 4,
        name: "Keval tadaviya",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&q=80",
    },
    {
        id: 5,
        name: "Manav Valani",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&q=80",
    },
];

const PopularTailors = () => {
    return (
        <div className="bg-black text-white px-6 py-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Popular Tailors</h2>
                <span className="text-yellow-400 text-sm cursor-pointer hover:underline">
                    See Map
                </span>
            </div>

            <div className="flex gap-6 overflow-x-auto no-scrollbar">
                {tailors.map((item) => (
                    <div key={item.id} className="flex flex-col items-center min-w-[90px]">

                        <div className="relative">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 rounded-xl object-cover border border-gray-700"
                            />

                            <div className="absolute -bottom-2 right-1  bg-yellow-400 text-black text-[10px] px-2 py-[2px] rounded-md font-semibold flex items-center gap-1">
                                {item.rating}
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-center w-[80px] truncate">
                            {item.name}
                        </p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularTailors;