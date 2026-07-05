'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import Controller from './Controller'

/**
 * Procedural Three.js DualShock 2 (no external model — built from an
 * extruded silhouette + primitives, lit like it's sitting in front of
 * the CRT). The START pill is a real raycast target; a visually hidden
 * button keeps keyboard access. Falls back to the SVG controller when
 * WebGL is unavailable.
 */
export default function Controller3D({
  pulsing,
  onStart,
}: {
  pulsing: boolean
  onStart: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const pulsingRef = useRef(pulsing)
  const onStartRef = useRef(onStart)
  pulsingRef.current = pulsing
  onStartRef.current = onStart

  useEffect(() => {
    const container = containerRef.current
    if (!container || failed) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setFailed(true)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 640 / 420, 0.1, 50)
    camera.position.set(0, 0.9, 7.5)
    camera.lookAt(0, -0.15, 0)

    /* ---------- lights: blue CRT key + rim, warm lamp fill ---------- */
    scene.add(new THREE.AmbientLight(0x141828, 1.6))
    const key = new THREE.DirectionalLight(0x9fb4e8, 1.9)
    key.position.set(0.5, 2, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x4a7aff, 2.2)
    rim.position.set(0, 3, -3)
    scene.add(rim)
    const lamp = new THREE.PointLight(0xff9a50, 14, 20)
    lamp.position.set(-4.5, 1, 2)
    scene.add(lamp)
    const startLight = new THREE.PointLight(0x8ab4ff, 0, 3)
    startLight.position.set(0.35, 0.12, 1.2)
    scene.add(startLight)

    /* ---------- materials ---------- */
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x121217,
      roughness: 0.52,
      metalness: 0.18,
    })
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0e0e13,
      roughness: 0.6,
      metalness: 0.1,
    })
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x131318, roughness: 0.9 })
    const startMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      roughness: 0.4,
      emissive: 0x4a7aff,
      emissiveIntensity: 0.15,
    })

    const group = new THREE.Group()
    scene.add(group)

    /* ---------- body: DualShock silhouette, extruded + beveled ---------- */
    const s = new THREE.Shape()
    s.moveTo(-0.7, 1.02)
    s.bezierCurveTo(-1.65, 1.02, -2.32, 0.55, -2.32, -0.1)
    s.bezierCurveTo(-2.36, -0.5, -2.2, -0.85, -2.05, -1.15)
    s.bezierCurveTo(-1.95, -1.55, -1.75, -2.05, -1.42, -2.15)
    s.bezierCurveTo(-1.12, -2.24, -0.94, -1.92, -0.9, -1.5)
    s.bezierCurveTo(-0.86, -1.08, -0.6, -0.72, 0, -0.72)
    s.bezierCurveTo(0.6, -0.72, 0.86, -1.08, 0.9, -1.5)
    s.bezierCurveTo(0.94, -1.92, 1.12, -2.24, 1.42, -2.15)
    s.bezierCurveTo(1.75, -2.05, 1.95, -1.55, 2.05, -1.15)
    s.bezierCurveTo(2.2, -0.85, 2.36, -0.5, 2.32, -0.1)
    s.bezierCurveTo(2.32, 0.55, 1.65, 1.02, 0.7, 1.02)
    s.bezierCurveTo(0.28, 0.92, -0.28, 0.92, -0.7, 1.02)
    const bodyGeo = new THREE.ExtrudeGeometry(s, {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.14,
      bevelSegments: 6,
      curveSegments: 32,
    })
    bodyGeo.translate(0, 0, -0.35) // center the slab; front face ends ≈ z 0.15
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    group.add(body)
    const zTop = 0.18 // resting surface for controls

    /* ---------- grips: capsules bulging under the handles ---------- */
    for (const side of [-1, 1]) {
      const grip = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 1.25, 6, 14), bodyMat)
      grip.position.set(side * 1.58, -1.2, -0.24)
      grip.rotation.z = side * 0.35
      grip.rotation.x = 0.3
      group.add(grip)
    }

    /* ---------- shoulder buttons ---------- */
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.22, 0.2, 3, 0.08), darkMat)
      shoulder.position.set(side * 1.35, 1.0, -0.14)
      group.add(shoulder)
    }

    /* ---------- D-pad ---------- */
    const dpadA = new THREE.Mesh(new RoundedBoxGeometry(0.74, 0.22, 0.1, 3, 0.04), darkMat)
    dpadA.position.set(-1.35, 0.28, zTop)
    const dpadB = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.74, 0.1, 3, 0.04), darkMat)
    dpadB.position.set(-1.35, 0.28, zTop)
    group.add(dpadA, dpadB)

    /* ---------- face buttons with canvas symbol textures ---------- */
    const symbolTexture = (draw: (c: CanvasRenderingContext2D) => void, color: string) => {
      const cv = document.createElement('canvas')
      cv.width = cv.height = 128
      const c = cv.getContext('2d')!
      c.fillStyle = '#101016'
      c.fillRect(0, 0, 128, 128)
      c.strokeStyle = color
      c.lineWidth = 9
      c.lineJoin = 'round'
      c.lineCap = 'round'
      draw(c)
      const tex = new THREE.CanvasTexture(cv)
      tex.anisotropy = 4
      return tex
    }
    const symbols: Array<{ tex: THREE.CanvasTexture; dx: number; dy: number }> = [
      {
        // triangle (top)
        tex: symbolTexture((c) => {
          c.beginPath()
          c.moveTo(64, 34)
          c.lineTo(92, 88)
          c.lineTo(36, 88)
          c.closePath()
          c.stroke()
        }, '#3fa65c'),
        dx: 0,
        dy: 0.36,
      },
      {
        // circle (right)
        tex: symbolTexture((c) => {
          c.beginPath()
          c.arc(64, 64, 30, 0, Math.PI * 2)
          c.stroke()
        }, '#c9503f'),
        dx: 0.36,
        dy: 0,
      },
      {
        // cross (bottom)
        tex: symbolTexture((c) => {
          c.beginPath()
          c.moveTo(38, 38)
          c.lineTo(90, 90)
          c.moveTo(90, 38)
          c.lineTo(38, 90)
          c.stroke()
        }, '#7a9ccc'),
        dx: 0,
        dy: -0.36,
      },
      {
        // square (left)
        tex: symbolTexture((c) => {
          c.strokeRect(38, 38, 52, 52)
        }, '#c77ba8'),
        dx: -0.36,
        dy: 0,
      },
    ]
    const btnSide = new THREE.MeshStandardMaterial({ color: 0x101016, roughness: 0.4 })
    for (const sym of symbols) {
      const topMat = new THREE.MeshStandardMaterial({
        map: sym.tex,
        emissiveMap: sym.tex,
        emissive: 0xffffff,
        emissiveIntensity: 0.35,
        roughness: 0.35,
      })
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.1, 32), [
        btnSide,
        topMat,
        darkMat,
      ])
      btn.rotation.x = Math.PI / 2 // cylinder top (+Y) faces the camera (+Z)
      btn.position.set(1.35 + sym.dx, 0.28 + sym.dy, zTop)
      group.add(btn)
    }

    /* ---------- center cluster: SELECT / ANALOG / START ---------- */
    const select = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.13, 0.09, 2, 0.04), darkMat)
    select.position.set(-0.35, 0.14, zTop)
    group.add(select)
    const analogBtn = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.11, 0.07, 2, 0.03), darkMat)
    analogBtn.position.set(0, -0.05, zTop)
    group.add(analogBtn)

    const startBtn = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.15, 0.1, 2, 0.05), startMat)
    startBtn.position.set(0.35, 0.14, zTop)
    group.add(startBtn)
    // pulsing glow ring around START
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.24, 0.27, 40),
      new THREE.MeshBasicMaterial({
        color: 0x8ab4ff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
    )
    ring.position.set(0.35, 0.14, zTop + 0.08)
    group.add(ring)

    /* ---------- analog sticks ---------- */
    for (const side of [-1, 1]) {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.08, 28), darkMat)
      base.rotation.x = Math.PI / 2
      base.position.set(side * 0.58, -0.62, zTop)
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3, 20), rubberMat)
      stem.rotation.x = Math.PI / 2
      stem.position.set(side * 0.58, -0.62, zTop + 0.15)
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), rubberMat)
      cap.scale.set(1, 1, 0.55)
      cap.position.set(side * 0.58, -0.62, zTop + 0.3)
      group.add(base, stem, cap)
    }

    /* ---------- cable, up and away from the top edge ---------- */
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.95, 0),
      new THREE.Vector3(0, 1.7, -0.5),
      new THREE.Vector3(-0.5, 2.7, -1.1),
      new THREE.Vector3(0.3, 3.8, -1.7),
    ])
    const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 32, 0.055, 10), darkMat)
    group.add(cable)

    const baseTiltX = -0.5
    group.rotation.x = baseTiltX

    /* ---------- interaction ---------- */
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let pressed = false

    const pick = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      return raycaster.intersectObjects([startBtn, ring]).length > 0
    }
    const onPointerMove = (e: PointerEvent) => {
      renderer.domElement.style.cursor = pick(e) ? 'pointer' : 'default'
    }
    const firePress = () => {
      if (pressed) return
      pressed = true
      setTimeout(() => {
        pressed = false
        onStartRef.current()
      }, 140)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (pick(e)) firePress()
    }
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)

    // Ambient mouse parallax over the whole window
    let mx = 0
    let my = 0
    const onWindowMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (!reduced) window.addEventListener('mousemove', onWindowMove)

    /* ---------- sizing ---------- */
    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    /* ---------- loop ---------- */
    const t0 = performance.now()
    let raf = 0
    const tick = () => {
      const t = reduced ? 0 : (performance.now() - t0) / 1000
      if (!reduced) {
        group.position.y = Math.sin(t * 0.9) * 0.05
        group.rotation.z = Math.sin(t * 0.6) * 0.015
        group.rotation.y += (mx * 0.18 - group.rotation.y) * 0.05
        group.rotation.x += (baseTiltX + my * 0.07 - group.rotation.x) * 0.05
      }
      const pulse = pulsingRef.current
      const wave = 0.5 + 0.5 * Math.sin(t * 4)
      startLight.intensity = pulse ? 2 + 6 * wave : 0
      startMat.emissiveIntensity = pulse ? 0.3 + 1.2 * wave : 0.15
      const ringMat = ring.material as THREE.MeshBasicMaterial
      if (pulse) {
        const cycle = (t % 1.5) / 1.5
        ring.scale.setScalar(1 + cycle * 0.9)
        ringMat.opacity = 0.7 * (1 - cycle)
      } else {
        ringMat.opacity = 0
      }
      startBtn.position.z = pressed ? zTop - 0.04 : zTop
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('mousemove', onWindowMove)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          for (const m of mats) {
            const std = m as THREE.MeshStandardMaterial
            std.map?.dispose()
            std.emissiveMap?.dispose()
            m.dispose()
          }
        }
      })
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [failed])

  if (failed) return <Controller pulsing={pulsing} onStart={onStart} />

  return (
    <div
      ref={containerRef}
      className="relative w-full drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
      style={{ aspectRatio: '640 / 420' }}
      role="img"
      aria-label="3D PlayStation 2 DualShock controller — press START to enter the site"
    >
      {/* keyboard-accessible START */}
      <button
        type="button"
        onClick={onStart}
        className="absolute left-[56%] top-[40%] z-10 h-10 w-14 -translate-x-1/2 -translate-y-1/2 opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ps2-light"
        aria-label="Press START to enter the portfolio"
      />
    </div>
  )
}
