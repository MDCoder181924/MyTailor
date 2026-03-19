import React from "react";
import { Mail, Globe, Share2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 px-6 py-12 border-t border-zinc-800">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-white text-xl font-serif mb-4">
            THE DIGITAL ATELIER
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            Reimagining the traditional tailoring experience for the modern digital age.
            Crafting excellence, one stitch at a time.
          </p>

          <div className="flex gap-4 text-gray-500">
            <Share2 size={18} className="hover:text-yellow-400 cursor-pointer" />
            <Globe size={18} className="hover:text-yellow-400 cursor-pointer" />
            <Mail size={18} className="hover:text-yellow-400 cursor-pointer" />
          </div>
        </div>

        <div>
          <h3 className="text-yellow-400 text-sm mb-4 uppercase">
            Atelier Services
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Bespoke Suits</li>
            <li className="hover:text-white cursor-pointer">Fabric Marketplace</li>
            <li className="hover:text-white cursor-pointer">Corporate Gifting</li>
            <li className="hover:text-white cursor-pointer">Gift Cards</li>
          </ul>
        </div>

        <div>
          <h3 className="text-yellow-400 text-sm mb-4 uppercase">
            Information
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Shipping</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-yellow-400 text-sm mb-4 uppercase">
            The Atelier Club
          </h3>
          <p className="text-sm mb-4">
            Join our inner circle for early access to seasonal fabric releases and private trunk shows.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="bg-zinc-900 text-sm px-3 py-2 outline-none w-full"
            />
            <button className="bg-yellow-400 text-black px-4 text-sm font-medium">
              JOIN
            </button>
          </div>
        </div>

      </div>

      <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between text-xs text-gray-500">
        <p>2024 THE DIGITAL ATELIER. ALL RIGHTS RESERVED</p>
        <div className="flex gap-6 mt-3 md:mt-0">
          <span>HANDCRAFTED IN ITALY</span>
          <span>GLOBAL SHIPPING</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;