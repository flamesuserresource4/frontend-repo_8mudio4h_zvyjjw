import React from 'react'
import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import Collections from './components/Collections'
import Craftsmanship from './components/Craftsmanship'
import Footer from './components/Footer'
import './index.css'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <Hero3D />
        <Collections />
        <Craftsmanship />
      </main>
      <Footer />
    </div>
  )
}
