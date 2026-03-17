import React from "react";

const Footer = () => {
  return (
    <div className="bg-black text-gray-400 px-6 md:px-16 py-16 border-t border-gray-800 md:h-[50vh]">

      <div className="grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-yellow-400 text-xl font-bold">StitchPerfect</h2>
          <p className="mt-3 text-sm">
            Revolutionizing the world of bespoke tailoring.
            Connecting global masters with style connoisseurs.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li>About</li>
            <li>How It Works</li>
            <li>Tailor Partners</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li>Privacy Policy</li>
            <li>Terms</li>
            <li>Shipping</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="text-white font-semibold mb-3">Subscribe</h3>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded mb-3"
          />

          <button className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition">
            Join
          </button>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 text-sm text-gray-500 flex flex-col md:flex-row justify-between">
        <p>© 2025 StitchPerfect. All rights reserved.</p>
        <p>Made for the discerning you.</p>
      </div>

    </div>
  );
};

export default Footer;