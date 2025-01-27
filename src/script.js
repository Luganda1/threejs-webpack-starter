import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//texture loader
const loader = new THREE.TextureLoader;
const star = loader.load('../star.png')
console.log(star)

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.SphereBufferGeometry( .7, 50, 54, );
const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 1200;

const posArray = new Float32Array(particlesCnt * 3);
// xyz * xyz *xyz

for(let i = 0; i < particlesCnt*3; i++) {
    // posArray[i] = Math.random()
    posArray[i] = (Math.random()- 0.5) *5
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

const material = new THREE.PointsMaterial({
    size: 0.0005
})

const particlesmaterial = new THREE.PointsMaterial({
    size: 0.019,
    map: star,
    transparent: true,
    color: 0xfeffd6,
    blending: THREE.AdditiveBlending
})


// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesmaterial)
scene.add(sphere, particlesMesh)

// Lights

const pointLight = new THREE.PointLight(0xaaaaaa, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(new THREE.Color('#001b1f'))
})

document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event) {
    mouseX = event.clientX 
    mouseY = event.clientY
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .4 * elapsedTime
    sphere.rotation.x = .2 * elapsedTime
    particlesMesh.rotation.y = -.1 * elapsedTime

    if(mouseX > 0) {
        particlesMesh.rotation.x = -mouseY * (elapsedTime *0.000008)
        particlesMesh.rotation.y = -mouseX * (elapsedTime *0.000008)
    }

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()