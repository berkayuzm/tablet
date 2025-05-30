import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js'
import { Group } from 'three/examples/jsm/libs/tween.module.js'
import { Tween, Easing } from '@tweenjs/tween.js';
import * as TWEEN from '@tweenjs/tween.js';




// Instantiate a loader
const loader = new PCDLoader ()

// Load a resourse
loader.load 
(
    'map_3d.pcd' ,

    function ( points ) {
        points.rotation.set(Math.PI , Math.PI , Math.PI)
       scene.add(points) 
    } , 
    function ( xhr ) {
        console.log (( xhr.loaded / xhr.total * 100 ).toFixed(0) + ' % loaded ')
        const loadedPercent = xhr.loaded / xhr.total * 100 // This part creating a progress bar until map is downloaded.
        document.getElementById('progress-text').textContent = `${loadedPercent.toFixed(2)}`;
        if( loadedPercent === 100) {
            setTimeout (() => {
                document.getElementById('loading-screen').style.display = 'none'; 
            })
        }
    } ,

    function ( error ) {
        console.log('An error happened')
    }
)


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth ,
    height: window.innerHeight
}


/**
 * Cleaner Machine
 */
const cleanerMachineGroup = new THREE.Group()

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const box = new THREE.Mesh(boxGeometry, redMaterial)
box.position.set(0 , 0 , 0)

const circleGeometry = new THREE.RingGeometry(.9 , 1 , 128)
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 ,  side: THREE.DoubleSide })
const circle = new THREE.Mesh(circleGeometry , greenMaterial)
const circle2 = new THREE.Mesh(circleGeometry , greenMaterial)
const cirlce3 = new THREE.Mesh(circleGeometry , greenMaterial)
circle.rotation.x = Math.PI / 2
circle2.rotation.y = Math.PI / 2
cirlce3.rotation.z = Math.PI / 2 
circle.position.set(0 , 0 , 0)
circle2.position.set(0 , 0 , 0)
circle.position.set(0 , 0 , 0)

cleanerMachineGroup.add(box)
cleanerMachineGroup.add(circle)
cleanerMachineGroup.add(circle2)
cleanerMachineGroup.add(cirlce3)

scene.add (cleanerMachineGroup)


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height , 1 , 1000)
camera.position.set(0 , 0 , 3)
scene.add(camera)


// Define initial offset between camera and cleanerMachineGroup
const cameraOffset = new THREE.Vector3(0, -10, 10) 

// Initial camera position based on cleanerMachineGroup position
camera.position.copy(cleanerMachineGroup.position).add(cameraOffset)
camera.lookAt(cleanerMachineGroup.position)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth , window.innerHeight )
document.body.appendChild(renderer.domElement)
renderer.render(scene, camera)


// Controls 
const controls = new OrbitControls(camera , renderer.domElement)
controls.enablePan = true
controls.enableZoom = true
controls.enableDamping = false
controls.dampingFactor = 0.25
controls.enableRotate = true

// Limits
const minPolarAngle = Math.PI / 2 // 0 radians
const maxPolarAngle = Math.PI  // 90 degrees
const minAzimuthAngle = -Math.PI / 2 // -90 degrees
const maxAzimuthAngle = Math.PI / 2 // 90 degrees

// Apply limits
controls.minPolarAngle = minPolarAngle;
controls.maxPolarAngle = maxPolarAngle;
controls.minAzimuthAngle = minAzimuthAngle;
controls.maxAzimuthAngle = maxAzimuthAngle;

controls.update()








// Function to update camera position and target smoothly
function updateCameraSmoothly(targetPosition, targetLookAt, duration = 1000) {
    const initialPosition = camera.position.clone();
    const initialLookAt = controls.target.clone();

    new TWEEN.Tween(initialPosition)
        .to(targetPosition, duration)
        .easing(Easing.Quadratic.Out) // Add easing for smooth transition
        .onUpdate(() => {
            camera.position.copy(initialPosition);
        })
        .start();

    new TWEEN.Tween(initialLookAt)
        .to(targetLookAt, duration)
        .easing(Easing.Quadratic.Out) // Add easing for smooth transition
        .onUpdate(() => {
            controls.target.copy(initialLookAt);
            controls.update();
        })
        .start();
}


// Function to update position based on key input and move camera
function moveCleanerMachine(event) {
    const step = 0.5 

    switch (event.key) {
        case 'ArrowUp': 
            cleanerMachineGroup.position.y += step
            //camera.position.y += step
            break;
        case 'ArrowDown': 
            cleanerMachineGroup.position.y -= step
            //camera.position.y -= step
            break;
        case 'ArrowLeft': 
            cleanerMachineGroup.position.x -= step
            //camera.position.x -= step
            break;
        case 'ArrowRight': 
            cleanerMachineGroup.position.x += step
            //camera.position.x += step
            break;
    }

    updateCamera()

    // Calculate new camera position and lookAt position
    const newCameraPosition = cleanerMachineGroup.position.clone().add(cameraOffset)
    const newLookAtPosition = cleanerMachineGroup.position.clone()

    // Move camera smoothly
    updateCameraSmoothly(newCameraPosition, newLookAtPosition, 500); // 500 milliseconds
}

// Add event listener for keydown
document.addEventListener('keydown', moveCleanerMachine)    

/*
function updateCamera() {
    camera.position.copy(cleanerMachineGroup.position).add(cameraOffset);
    controls.target.copy(cleanerMachineGroup.position);
    camera.lookAt(cleanerMachineGroup.position);
}*/

/*
function updateCameraAngleDisplay() {
    const angle = document.getElementById('angle')
    const { x , y , z } = camera.position
    angle.innerHTML = `Camera.: <br> x = ${x.toFixed(2)}<br> y = ${y.toFixed(2)}<br> z = ${z.toFixed(2)} `
}*/

function resetCameraPosition () {
    camera.position.copy(cameraOffset)
    const targetPosition = cleanerMachineGroup.position
    camera.lookAt(targetPosition)
    controls.update
}

document.getElementById('camera-reset-button').addEventListener('click', resetCameraPosition);

function positionOfObject() {
    const info = document.getElementById('info')
    const { x , y , z } = box.position
    angle.innerHTML = `Object Positio: <br> x = ${x.toFixed(0)}<br> y = ${y.toFixed(0)}<br> z = ${z.toFixed(0)} `
}

function onWindowResize() {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize( sizes.width , sizes.height )
}

function cleanerGroupRotation () {
    cleanerMachineGroup.rotation.x -= 0.01
    cleanerMachineGroup.rotation.y += 0.01
    cleanerMachineGroup.rotation.z += 0.01
}

function cleanerCirlceRotation () {
    circle.rotation.x += 0.02
    circle.rotation.y += 0.02
    circle.rotation.z += 0.02

    circle2.rotation.x -= 0.02
    circle2.rotation.y -= 0.02
    circle2.rotation.z -= 0.02

    cirlce3.rotation.x -= 0.02
    cirlce3.rotation.y += 0.02
    cirlce3.rotation.z -= 0.02
}

// Animation
function animate() 
    {
        controls.update()
       
        cleanerGroupRotation()
        cleanerCirlceRotation()
        // positionOfObject()
        
        // Render
        renderer.render(scene , camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(animate) 
    }
    



window.addEventListener('resize', onWindowResize);
animate()