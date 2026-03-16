import React from 'react'

const Section4 = () => {
  return (
    <section id="gallery" className="py-20 bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl text-white font-semibold">Design Feed</h2>
        <p className="mt-3 text-gray-300">Browse recent designs from our community.</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-40 bg-white/5 rounded" />
          <div className="h-40 bg-white/5 rounded" />
          <div className="h-40 bg-white/5 rounded" />
          <div className="h-40 bg-white/5 rounded" />
        </div>
      </div>
    </section>
  )
}

export default Section4
