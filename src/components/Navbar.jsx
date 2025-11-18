import React from 'react'
import { ShoppingCart, Menu } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/30" />
          <span className="text-white font-serif text-xl tracking-wide">Chronomaster</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-200">
          <a href="#home" className="hover:text-white transition">Home</a>
          <a href="#collections" className="hover:text-white transition">Collections</a>
          <a href="#about" className="hover:text-white transition">About Us</a>
          <a href="#craftsmanship" className="hover:text-white transition">Craftsmanship</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="relative text-slate-200 hover:text-white transition" aria-label="Cart">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 text-[10px] bg-blue-500 text-white rounded-full px-1">2</span>
          </button>
          <button className="md:hidden text-slate-200 hover:text-white transition" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
