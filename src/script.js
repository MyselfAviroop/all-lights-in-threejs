import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

// Hemisphere Light - subtle, ambient lighting from above and below
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.8);
scene.add(hemisphereLight);
gui.add(hemisphereLight, 'intensity').min(0).max(2).step(0.01).name("Hemisphere Intensity");

// Directional Light - strong light from a specific direction
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, -3);
scene.add(directionalLight);
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.1);
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.1);
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.1);
gui.add(directionalLight, 'intensity').min(0).max(2).step(0.01).name("Directional Intensity");

// Point Light - localized light source like a light bulb
const pointLight = new THREE.PointLight(0x00ff00, 1, 10);
pointLight.position.set(2, 3, 1);
scene.add(pointLight);
gui.add(pointLight, 'intensity').min(0).max(5).step(0.1).name("Point Light Intensity");

// Spotlight - spotlight effect with focus
const spotLight = new THREE.SpotLight(0x0000ff, 1, 10, Math.PI * 0.1);
spotLight.position.set(-3, 3, 3);
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight);
scene.add(spotLight.target);
gui.add(spotLight, 'intensity').min(0).max(5).step(0.1).name("Spotlight Intensity");

/**
 * Objects
 */
const material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
material.roughness = 0.4;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 5);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
