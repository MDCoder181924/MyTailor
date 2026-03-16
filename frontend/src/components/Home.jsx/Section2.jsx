import React from 'react'

const Section2 = () => {
  return (
    <section id="customers" className="py-20 bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl text-white font-semibold">For Customers</h2>
        <p className="mt-3 text-gray-300">Discover tailored services, browse portfolios, and place custom orders.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-lg">Feature 1</div>
          <div className="p-4 bg-white/5 rounded-lg">Feature 2</div>
          <div className="p-4 bg-white/5 rounded-lg">Feature 3</div>
        </div>
      </div>
    </section>
  )
}

export default Section2
