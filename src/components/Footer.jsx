import React from 'react'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer(){
  return (
    <footer id="contact" className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-slate-300">
        <div>
          <p className="font-serif text-xl text-white mb-2">Chronomaster</p>
          <p className="text-slate-400 text-sm">Exclusivity, precision, and timeless elegance.</p>
        </div>
        <div>
          <p className="text-white font-medium mb-3">Company</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white">About Us</a></li>
            <li><a href="#craftsmanship" className="hover:text-white">Craftsmanship</a></li>
            <li><a href="#collections" className="hover:text-white">Collections</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-medium mb-3">Legal</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-medium mb-3">Newsletter</p>
          <form className="flex gap-2">
            <input type="email" placeholder="Your email" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <button className="px-4 rounded-lg bg-blue-600 text-white text-sm">Join</button>
          </form>
          <div className="flex gap-4 mt-4 text-slate-400">
            <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook className="w-5 h-5"/></a>
            <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram className="w-5 h-5"/></a>
            <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter className="w-5 h-5"/></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-6">© {new Date().getFullYear()} Chronomaster. All rights reserved.</div>
    </footer>
  )
}
