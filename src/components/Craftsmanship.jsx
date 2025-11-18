import React from 'react'

export default function Craftsmanship(){
  return (
    <section id="craftsmanship" className="relative py-24 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(234,179,8,0.06),transparent_40%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="font-serif text-3xl md:text-4xl text-white">Crafted To Endure</h3>
          <p className="text-slate-300 leading-relaxed">
            Each Chronomaster is assembled by artisans with decades of experience. We hand-polish every case, pressure-test sapphire crystals, and tune precision movements to exacting tolerances.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Our leathers are vegetable-tanned and finished to develop a rich patina. Steel components are cut to micron precision and finished in-house for a flawless sheen.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img className="rounded-xl object-cover h-48 w-full" src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop" alt="watchmaker"/>
          <img className="rounded-xl object-cover h-48 w-full" src="https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=1000&auto=format&fit=crop" alt="components"/>
          <img className="rounded-xl object-cover h-48 w-full" src="https://images.unsplash.com/photo-1595414440701-da000c40df9c?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxtYXRlcmlhbHN8ZW58MHwwfHx8MTc2MzQ4NTU0MXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="materials"/>
          <img className="rounded-xl object-cover h-48 w-full" src="https://images.unsplash.com/photo-1536181783029-1097aaf179de?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxhc3NlbWJseXxlbnwwfDB8fHwxNzYzNDg1NTQyfDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="assembly"/>
        </div>
      </div>
    </section>
  )
}
