import React from 'react';
import { Link } from 'react-router-dom';

const TailorTerms = () => {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500 opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-yellow-500 opacity-10 blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header section */}
        <div className="text-center mb-10">
          <Link to="/auth" className="text-sm text-teal-400 hover:text-teal-300 inline-flex items-center gap-2 mb-4 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Registration
          </Link>
          <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-wider bg-gradient-to-r from-teal-400 to-yellow-400 bg-clip-text text-transparent">
            Tailor Terms & Conditions
          </h1>
          <p className="mt-2 text-gray-400 text-sm">
            Please read these guidelines carefully. By registering, you agree to comply with all rules listed below.
          </p>
        </div>

        {/* Content card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8">
          
          {/* Section 1: Non-cancellation policy */}
          <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
            <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">1. Order Cancellation Policy</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                Once you accept or take an order from a customer, <span className="text-teal-400 font-semibold">you cannot remove or cancel it</span>. Fulfilling accepted orders is mandatory to maintain trust on the platform. Failure to complete an accepted order will result in a penalty and potential account suspension.
              </p>
            </div>
          </div>

          {/* Section 2: Home Delivery */}
          <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
            <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">2. Home Delivery Commitment</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                If the user chooses the <span className="text-teal-400 font-semibold">Home Delivery</span> option, you must arrange and provide delivery at the customer's specified address. You are responsible for ensuring the delivery is handled safely and on time.
              </p>
            </div>
          </div>

          {/* Section 3: Measurements */}
          <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
            <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7h7m-7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">3. Accuracy & Customer Measurements</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                You must stitch the products exactly according to the measurements, sizing, and design requests provided by the customer. Any alteration requests due to deviation from customer specifications must be resolved by you at no additional cost.
              </p>
            </div>
          </div>

          {/* Section 4: Timeliness */}
          <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
            <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">4. Turnaround and Completion Time</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                Adhering to delivery deadlines is crucial. Tailors must complete orders within the committed turnaround times specified in their profile settings. Late shipments may trigger order cancellations or customer refund requests.
              </p>
            </div>
          </div>

          {/* Section 5: Platform Standards */}
          <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
            <div className="p-3 bg-teal-400/10 rounded-lg text-teal-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">5. Quality and Professional Standards</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                Maintain high-quality materials and professional work ethics. Communicate respectfully with customers. Misleading product displays, fake reviews, or using cheap materials in place of promised ones will lead to immediate ban of the tailor shop from E-Tailoring.
              </p>
            </div>
          </div>

        </div>

        {/* Footer/Action */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-4">
            E-Tailoring reserves the right to update these terms at any time. Tailors will be notified of major changes.
          </p>
          <button 
            onClick={() => window.close()} 
            className="px-6 py-2 border border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-black rounded-lg transition-all duration-300 text-sm font-semibold shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailorTerms;
