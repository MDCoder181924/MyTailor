import React, { useEffect, useRef, useState } from "react";

const data = [
    {
        id: 1,
        title: "Velvet Dinner Jacket",
        brand: "Savile Row",
        price: "$450",
        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7",
        topPick: true,
    },
    {
        id: 2,
        title: "Italian Linen Shirt",
        brand: "Modern Stitch",
        price: "$120",
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
        topPick: false,
    },
    {
        id: 3,
        title: "Classic Black Suit",
        brand: "Armani",
        price: "$600",
        image: "https://taylor-dresses.com/wp-content/uploads/2025/06/Womens-Square-Neck-Button-Front-A-Line-Dress.jpg",
        topPick: true,
    },
    {
        id: 4,
        title: "Casual Denim Jacket",
        brand: "Levi's",
        price: "$180",
        image: "https://images.unsplash.com/photo-1516826957135-700dedea698c",
        topPick: false,
    },
    {
        id: 5,
        title: "Slim Fit Blazer",
        brand: "Zara",
        price: "$200",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
        topPick: true,
    },
    {
        id: 6,
        title: "Formal White Shirt",
        brand: "Hugo Boss",
        price: "$150",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        topPick: false,
    },
    {
        id: 7,
        title: "Premium Wool Coat",
        brand: "Burberry",
        price: "$850",
        image: "https://images.unsplash.com/photo-1544441893-675973e31985",
        topPick: true,
    },
    {
        id: 8,
        title: "Checked Casual Shirt",
        brand: "Tommy Hilfiger",
        price: "$130",
        image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8",
        topPick: false,
    },
    {
        id: 9,
        title: "Luxury Tuxedo",
        brand: "Gucci",
        price: "$1200",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
        topPick: true,
    },
    {
        id: 10,
        title: "Cotton Summer Shirt",
        brand: "Uniqlo",
        price: "$90",
        image: "https://images.unsplash.com/photo-1603251579431-8041402bdeda",
        topPick: false,
    },
];

const TrendingStyles = () => {



    const scrollRef = useRef();
    const [items, setItems] = useState([...data]);


    const loopData = [...data, ...data, ...data, ...data];

    useEffect(() => {
        const container = scrollRef.current;

        let scrollSpeed = 0.5; 

        const scroll = () => {
            if (!container) return;

            container.scrollLeft += scrollSpeed;

            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft -= container.scrollWidth / 2;
            }
        };

        const interval = setInterval(scroll, 16); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black text-white px-6 py-8">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Trending Styles</h2>
                <span className="text-yellow-400 cursor-pointer text-sm">
                    View All
                </span>
            </div>


            <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar  will-change-transform">
                {loopData.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="min-w-[250px]">

                        <div className="relative rounded-2xl overflow-hidden ">
                            <img
                                src={`${item.image}?w=400&q=80`}
                                alt={item.title}
                                loading="lazy"
                                className="w-full h-[320px] object-cover"
                            />
                            {item.topPick && (
                                <span className="absolute bottom-3 left-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded-md font-medium">
                                    TOP PICK
                                </span>
                            )}
                        </div>

                        <div className="mt-3">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-gray-400 text-sm">
                                by {item.brand} •{" "}
                                <span className="text-yellow-400">{item.price}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingStyles;