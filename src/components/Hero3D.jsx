import React, { useRef, useState, useEffect } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'

// Lightweight Canvas-based 3D viewer for performance
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)) }

export default function Hero3D() {
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [rot, setRot] = useState({ x: -15, y: 30 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true })
    if (!gl) return

    // Vertex + fragment shader for a stylized metallic body
    const vsSrc = `
      attribute vec3 position; 
      attribute vec3 normal; 
      uniform mat4 mvp; 
      uniform mat3 normalMat; 
      varying vec3 vNormal; 
      varying vec3 vPos; 
      void main(){ 
        vNormal = normalize(normalMat * normal); 
        vec4 worldPos = vec4(position,1.0); 
        vPos = worldPos.xyz; 
        gl_Position = mvp * worldPos; 
      }`

    const fsSrc = `
      precision highp float; 
      varying vec3 vNormal; 
      varying vec3 vPos; 
      uniform vec3 uLight; 
      uniform float uGloss; 
      uniform vec3 uBase; 
      void main(){
        vec3 N = normalize(vNormal);
        vec3 L = normalize(uLight - vPos);
        vec3 V = normalize(-vPos);
        vec3 H = normalize(L+V);
        float diff = max(dot(N,L),0.0);
        float spec = pow(max(dot(N,H),0.0), uGloss);
        vec3 metal = uBase * (0.15 + 0.85*diff) + vec3(1.0)*spec*0.8;
        // cool-toned reflection tint
        metal += vec3(0.05,0.09,0.15) * (0.5 + 0.5*N.y);
        gl_FragColor = vec4(metal, 1.0);
      }`

    function compile(type, src){
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(sh))
      }
      return sh
    }

    const vs = compile(gl.VERTEX_SHADER, vsSrc)
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc)
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // Create a simplified watch: body (cylinder-ish), glass (disc), strap (bands)
    function createLathe(radiusTop, radiusBottom, height, slices){
      const positions=[], normals=[], indices=[]
      for(let i=0;i<=slices;i++){
        const t = i/slices
        const ang = t*Math.PI*2
        const ct=Math.cos(ang), st=Math.sin(ang)
        const rTop = radiusTop, rBot = radiusBottom
        const xTop = rTop*ct, yTop = rTop*st
        const xBot = rBot*ct, yBot = rBot*st
        positions.push(xTop,yTop, height/2, xBot,yBot,-height/2)
        const nx=ct, ny=st
        normals.push(nx,ny,0, nx,ny,0)
        if(i<slices){
          const a=i*2, b=i*2+1, c=i*2+2, d=i*2+3
          indices.push(a,b,c, b,d,c)
        }
      }
      return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) }
    }

    function createDisc(radius, z, slices){
      const positions=[0,0,z], normals=[0,0,1]
      const indices=[]
      for(let i=0;i<=slices;i++){
        const ang=i/slices*2*Math.PI
        const x=Math.cos(ang)*radius, y=Math.sin(ang)*radius
        positions.push(x,y,z)
        normals.push(0,0,1)
        if(i>0){ indices.push(0,i,i+1) }
      }
      return { positions:new Float32Array(positions), normals:new Float32Array(normals), indices:new Uint16Array(indices) }
    }

    function createStrap(width, length, z, segments){
      const positions=[], normals=[], indices=[]
      for(let i=0;i<=segments;i++){
        const t=i/segments
        const y=(t-0.5)*length
        positions.push(-width/2,y,z, width/2,y,z)
        normals.push(0,0,1, 0,0,1)
        if(i<segments){
          const a=i*2, b=i*2+1, c=i*2+2, d=i*2+3
          indices.push(a,b,c, b,d,c)
        }
      }
      return { positions:new Float32Array(positions), normals:new Float32Array(normals), indices:new Uint16Array(indices) }
    }

    const body = createLathe(1.2, 1.2, 0.5, 96)
    const bezel = createLathe(1.3, 1.25, 0.15, 96)
    const glass = createDisc(1.1, 0.26, 96)
    const strap1 = createStrap(0.9, 3.0, -0.1, 40)
    const strap2 = createStrap(0.9, 3.0, 0.1, 40)

    function bufferMesh(mesh){
      const vao = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vao); gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW)
      const nbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, nbo); gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW)
      const ibo = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
      return { vao, nbo, ibo, count: mesh.indices.length }
    }

    const meshes = {
      body: bufferMesh(body), bezel: bufferMesh(bezel), glass: bufferMesh(glass), strap1: bufferMesh(strap1), strap2: bufferMesh(strap2)
    }

    const posLoc = gl.getAttribLocation(prog, 'position')
    const norLoc = gl.getAttribLocation(prog, 'normal')
    const mvpLoc = gl.getUniformLocation(prog, 'mvp')
    const normalMatLoc = gl.getUniformLocation(prog, 'normalMat')
    const lightLoc = gl.getUniformLocation(prog, 'uLight')
    const glossLoc = gl.getUniformLocation(prog, 'uGloss')
    const baseLoc = gl.getUniformLocation(prog, 'uBase')

    function bindMesh(mesh){
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vao)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nbo)
      gl.enableVertexAttribArray(norLoc)
      gl.vertexAttribPointer(norLoc, 3, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo)
    }

    function perspective(fov, aspect, near, far){
      const f = 1/Math.tan((fov*Math.PI/180)/2)
      const nf = 1/(near - far)
      return new Float32Array([
        f/aspect,0,0,0,
        0,f,0,0,
        0,0,(far+near)*nf,-1,
        0,0,(2*far*near)*nf,0
      ])
    }

    function multiply(a,b){
      const out=new Float32Array(16)
      for(let i=0;i<4;i++) for(let j=0;j<4;j++){
        out[i*4+j]=a[i*4+0]*b[0*4+j]+a[i*4+1]*b[1*4+j]+a[i*4+2]*b[2*4+j]+a[i*4+3]*b[3*4+j]
      }
      return out
    }
    function rotationYX(rx, ry){
      const cx=Math.cos(rx), sx=Math.sin(rx), cy=Math.cos(ry), sy=Math.sin(ry)
      return new Float32Array([
        cy, 0, sy, 0,
        sx*sy, cx, -sx*cy, 0,
        -cx*sy, sx, cx*cy, 0,
        0,0,-4,1
      ])
    }
    function scale(s){
      return new Float32Array([
        s,0,0,0,
        0,s,0,0,
        0,0,s,0,
        0,0,0,1
      ])
    }

    function normalMatFrom(m){
      // extract upper-left 3x3 and invert transpose (approx since rigid)
      return new Float32Array([
        m[0],m[1],m[2],
        m[4],m[5],m[6],
        m[8],m[9],m[10]
      ])
    }

    function draw(){
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = canvas.clientWidth*dpr
      const h = canvas.clientHeight*dpr
      if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h }
      gl.viewport(0,0,w,h)
      gl.clearColor(0,0,0,0)
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
      gl.enable(gl.DEPTH_TEST)

      const proj = perspective(35, w/h, 0.1, 100)
      const model = rotationYX(rot.x*Math.PI/180, rot.y*Math.PI/180)
      const s = scale(zoom)
      const mvp = multiply(proj, multiply(model, s))
      const nmat = normalMatFrom(model)

      gl.uniformMatrix4fv(mvpLoc, false, mvp)
      gl.uniformMatrix3fv(normalMatLoc, false, nmat)
      gl.uniform3f(lightLoc, 3, 3, 3)

      // Watch body - brushed steel
      gl.uniform1f(glossLoc, 64.0)
      gl.uniform3f(baseLoc, 0.7, 0.72, 0.75)
      bindMesh(meshes.body)
      gl.drawElements(gl.TRIANGLES, meshes.body.count, gl.UNSIGNED_SHORT, 0)

      // Bezel - slightly warmer tone
      gl.uniform1f(glossLoc, 96.0)
      gl.uniform3f(baseLoc, 0.8, 0.78, 0.72)
      bindMesh(meshes.bezel)
      gl.drawElements(gl.TRIANGLES, meshes.bezel.count, gl.UNSIGNED_SHORT, 0)

      // Glass - bright, high spec
      gl.uniform1f(glossLoc, 256.0)
      gl.uniform3f(baseLoc, 0.95, 0.98, 1.0)
      bindMesh(meshes.glass)
      gl.drawElements(gl.TRIANGLES, meshes.glass.count, gl.UNSIGNED_SHORT, 0)

      // Straps - leather tint
      gl.uniform1f(glossLoc, 16.0)
      gl.uniform3f(baseLoc, 0.25, 0.13, 0.08)
      bindMesh(meshes.strap1)
      gl.drawElements(gl.TRIANGLES, meshes.strap1.count, gl.UNSIGNED_SHORT, 0)
      bindMesh(meshes.strap2)
      gl.drawElements(gl.TRIANGLES, meshes.strap2.count, gl.UNSIGNED_SHORT, 0)

      requestAnimationFrame(draw)
    }
    draw()

    function onDown(e){ dragging.current=true; last.current={ x: e.clientX, y: e.clientY } }
    function onUp(){ dragging.current=false }
    function onMove(e){ if(!dragging.current) return; const dx=e.clientX-last.current.x; const dy=e.clientY-last.current.y; last.current={ x:e.clientX, y:e.clientY }; setRot(r=>({ x: clamp(r.x+dy*0.4, -85, 85), y: (r.y+dx*0.4)%360 })) }
    function onWheel(e){ setZoom(z=>clamp(z + (e.deltaY<0?0.05:-0.05), 0.7, 1.6)) }

    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <section id="home" className="relative min-h-[90vh] pt-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.2),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <div className="order-2 lg:order-1 py-8">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-6">
            Chronomaster Aura Series
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-indigo-200">Precision Redefined</span>
          </h1>
          <p className="text-slate-300/90 text-lg mb-8 max-w-prose">
            A celebration of timekeeping excellence. Crafted with sapphire crystal, hand-assembled gears, and a leather strap that ages to perfection.
          </p>
          <div className="flex items-center gap-4">
            <a href="#collections" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-indigo-600/40 transition transform hover:-translate-y-0.5">Shop Now</a>
            <button onClick={() => setZoom(z=>clamp(z+0.1,0.7,1.6))} className="px-4 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center gap-2"><ZoomIn className="w-4 h-4"/>Zoom</button>
            <button onClick={() => setZoom(z=>clamp(z-0.1,0.7,1.6))} className="px-4 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center gap-2"><ZoomOut className="w-4 h-4"/>Out</button>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative">
          <div className="relative mx-auto w-full aspect-square max-w-[640px] rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-2 ring-1 ring-white/10 shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full rounded-[inherit] cursor-grab active:cursor-grabbing" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10" />
          </div>
          <p className="text-center text-slate-400 text-sm mt-3">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </section>
  )
}
