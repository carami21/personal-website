'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Free-orbit 3D card for the resume page. Drag to spin it any way
 * (including upside down / on its side), scroll or pinch to zoom.
 * Front face is the real resume render; back face is a generated
 * PS2-style card back so it never looks blank mid-flip.
 */
export default function ResumeViewer3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [readMode, setReadMode] = useState(false)

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
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grab'
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
    camera.position.set(0, 0, 6.2)

    scene.add(new THREE.AmbientLight(0x141828, 1.8))
    const key = new THREE.DirectionalLight(0x9fb4e8, 1.6)
    key.position.set(1.5, 2, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x4a7aff, 1.4)
    rim.position.set(-2, -1.5, -3)
    scene.add(rim)

    /* ---------- resume card: thin box so the edge reads as paper ---------- */
    const aspect = 1700 / 1313 // resume image height / width
    const cardW = 3.2
    const cardH = cardW * aspect
    const cardDepth = 0.03

    const cardBackTexture = (() => {
      const cv = document.createElement('canvas')
      cv.width = 1024
      cv.height = Math.round(1024 * aspect)
      const c = cv.getContext('2d')!
      c.fillStyle = '#0d0d13'
      c.fillRect(0, 0, cv.width, cv.height)
      c.strokeStyle = 'rgba(138,180,255,0.35)'
      c.lineWidth = 6
      c.strokeRect(24, 24, cv.width - 48, cv.height - 48)
      c.textAlign = 'center'
      c.fillStyle = '#4a7aff'
      c.font = 'bold 120px "Times New Roman", serif'
      c.fillText('CR', cv.width / 2, cv.height / 2 - 20)
      c.fillStyle = 'rgba(232,232,240,0.55)'
      c.font = '32px monospace'
      c.fillText('CARLOS RAMIREZ // RESUME', cv.width / 2, cv.height / 2 + 60)
      return new THREE.CanvasTexture(cv)
    })()

    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xe8e8f0, roughness: 0.85 })
    let frontMat = new THREE.MeshStandardMaterial({ color: 0xe8e8f0, roughness: 0.7 })
    const backMat = new THREE.MeshStandardMaterial({
      map: cardBackTexture,
      roughness: 0.6,
      emissiveMap: cardBackTexture,
      emissive: 0xffffff,
      emissiveIntensity: 0.12,
    })

    const geo = new THREE.BoxGeometry(cardW, cardH, cardDepth)
    // box material order: +x, -x, +y, -y, +z (front), -z (back)
    const card = new THREE.Mesh(geo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat])
    scene.add(card)

    const loader = new THREE.TextureLoader()
    loader.load('/resume-front.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      frontMat.map = tex
      frontMat.color.set(0xffffff)
      frontMat.needsUpdate = true
      setLoaded(true)
    })

    /* ---------- zoom-to-cursor: dolly toward the point under the pointer, ---------- */
    /* not a fixed center. Registered before OrbitControls so it runs first   */
    /* on the shared 'wheel' listener and can stopImmediatePropagation to     */
    /* suppress OrbitControls' own (center-locked) wheel zoom.                */
    const minDistance = 3.2
    const maxDistance = 11
    const zoomRaycaster = new THREE.Raycaster()
    const zoomNdc = new THREE.Vector2()
    const dollyToCursor = (clientX: number, clientY: number, deltaY: number) => {
      const rect = renderer.domElement.getBoundingClientRect()
      zoomNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1
      zoomNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1
      zoomRaycaster.setFromCamera(zoomNdc, camera)
      const hit = zoomRaycaster.intersectObject(card, false)[0]
      const point = hit ? hit.point : controls.target
      const curDist = camera.position.distanceTo(controls.target)
      const newDist = THREE.MathUtils.clamp(curDist * Math.exp(deltaY * 0.0018), minDistance, maxDistance)
      const factor = newDist / curDist
      const camRel = camera.position.clone().sub(point).multiplyScalar(factor)
      const targetRel = controls.target.clone().sub(point).multiplyScalar(factor)
      camera.position.copy(point).add(camRel)
      controls.target.copy(point).add(targetRel)
    }
    /* ---------- horizontal pan (two-finger swipe): moves the camera+target ---------- */
    /* sideways in screen space, following the same math OrbitControls uses    */
    /* for its own drag-pan, so it feels consistent once "read mode" kicks in. */
    const panAxis = new THREE.Vector3()
    const panOffset = new THREE.Vector3()
    const panByPixelsX = (px: number) => {
      const dist = camera.position.distanceTo(controls.target)
      const targetDistance = dist * Math.tan((camera.fov / 2) * Math.PI / 180)
      const h = renderer.domElement.clientHeight || 1
      panAxis.setFromMatrixColumn(camera.matrix, 0) // camera-local right
      panOffset.copy(panAxis).multiplyScalar((px * 2 * targetDistance) / h)
      camera.position.add(panOffset)
      controls.target.add(panOffset)
    }

    const onWheelZoom = (e: WheelEvent) => {
      e.preventDefault()
      e.stopImmediatePropagation()
      userInteracted = true
      if (e.deltaX !== 0) panByPixelsX(e.deltaX)
      if (e.deltaY !== 0) dollyToCursor(e.clientX, e.clientY, e.deltaY)
    }
    renderer.domElement.addEventListener('wheel', onWheelZoom, { passive: false })

    /* ---------- controls: free orbit while zoomed out; past READ_DISTANCE ---------- */
    /* the card locks in place ("static") and drag/one-finger-touch switches   */
    /* from rotate to pan, so you move around the page instead of spinning it. */
    const READ_DISTANCE = 4.4
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = true
    controls.enableZoom = true // keeps pinch-to-zoom on touch; wheel zoom is intercepted above
    controls.minDistance = minDistance
    controls.maxDistance = maxDistance
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI
    controls.rotateSpeed = 0.9
    controls.zoomSpeed = 0.8
    controls.screenSpacePanning = true

    let inReadMode = false
    const applyReadMode = (on: boolean) => {
      inReadMode = on
      controls.mouseButtons.LEFT = on ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE
      controls.touches.ONE = on ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE
      setReadMode(on)
    }

    renderer.domElement.addEventListener('pointerdown', () => {
      renderer.domElement.style.cursor = 'grabbing'
    })
    window.addEventListener('pointerup', () => {
      renderer.domElement.style.cursor = 'grab'
    })

    /* ---------- gentle idle spin until the user first interacts ---------- */
    let userInteracted = false
    controls.addEventListener('start', () => {
      userInteracted = true
    })

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

    const localTarget = new THREE.Vector3()
    let raf = 0
    const tick = () => {
      if (!userInteracted && !reduced) {
        card.rotation.y += 0.004
      }
      const dist = camera.position.distanceTo(controls.target)
      const shouldRead = dist < READ_DISTANCE
      if (shouldRead !== inReadMode) applyReadMode(shouldRead)
      // keep the pan target from drifting past the page edges while reading,
      // in the card's own local space so this holds regardless of tilt
      localTarget.copy(controls.target)
      card.worldToLocal(localTarget)
      localTarget.x = THREE.MathUtils.clamp(localTarget.x, -cardW / 2, cardW / 2)
      localTarget.y = THREE.MathUtils.clamp(localTarget.y, -cardH / 2, cardH / 2)
      localTarget.z = THREE.MathUtils.clamp(localTarget.z, -0.4, 0.4)
      card.localToWorld(localTarget)
      controls.target.copy(localTarget)
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('wheel', onWheelZoom)
      controls.dispose()
      geo.dispose()
      edgeMat.dispose()
      frontMat.map?.dispose()
      frontMat.dispose()
      backMat.map?.dispose()
      backMat.dispose()
      cardBackTexture.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [failed])

  if (failed) {
    return (
      <div className="mx-auto flex aspect-[1313/1700] max-w-xs items-center justify-center rounded border border-ps2/30 bg-black/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/resume-front.jpg" alt="Carlos Ramirez resume" className="h-full w-full rounded object-contain" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm">
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ aspectRatio: '1 / 1' }}
        role="img"
        aria-label="Interactive 3D resume card — drag to rotate, scroll to zoom"
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">
            LOADING...
          </div>
        )}
      </div>
      <p className="mt-3 text-center font-mono text-xs text-muted">
        {readMode
          ? '[ READ MODE — DRAG OR TWO-FINGER SWIPE TO PAN — ZOOM OUT TO ROTATE AGAIN ]'
          : '[ DRAG TO ROTATE — SCROLL TO ZOOM — SWIPE TO PAN ]'}
      </p>
    </div>
  )
}
