import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar

const avatarTexture = new THREE.TextureLoader().load('avatar.png');

const avatar = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: avatarTexture }));

scene.add(avatar);


// Earth

const earthTexture = new THREE.TextureLoader().load('earth.jpeg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
  })
);

scene.add(earth);

//skills

const angularTexture = new THREE.TextureLoader().load('angular.png');

const angular = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: angularTexture }));

scene.add(angular);
// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

earth.add(moon);

earth.position.z = 30;
earth.position.setX(-10);

moon.position.z = 12;
moon.position.setX(-11);

avatar.position.z = -5;
avatar.position.x = 2;

angular.position.y = -10;
angular.position.z = 25;
angular.position.x = -5;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  angular.rotation.x += 0.01;
  angular.rotation.y += 0.01;
  
  earth.rotation.y += 0.001;

  moon.rotation.x += 0.001;

  avatar.rotation.y += 0.002;
  avatar.rotation.z += 0.002;
  // controls.update();

  renderer.render(scene, camera);
}

animate();