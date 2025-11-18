import React from 'react'

const collections = [
  { name: 'Aura', tag: 'Precision Redefined', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Luxe', tag: 'Gilded Sophistication', img: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Carbon', tag: 'Featherweight Strength', img: 'https://images.unsplash.com/photo-1524594227084-9ac165c2aa13?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Heritage', tag: 'Legacy in Motion', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop' },
]

export default function Collections(){
  return (
    <section id="collections" className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">Collections</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((c, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition transform">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"/>
                <div className="absolute bottom-0 p-4">
                  <p className="text-white font-semibold text-lg">{c.name}</p>
                  <p className="text-slate-300 text-sm">{c.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
