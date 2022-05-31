import "./style.css";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const SCREEN_WIDTH = window.innerWidth / 2;
const SCREEN_HEIGHT = window.innerHeight;

let container;

let camera, scene, scene2, renderer;

let mouseX = 0,
  mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    35,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    1,
    5000
  );
  camera.position.z = 1500;

  scene = new THREE.Scene();

  scene2 = new THREE.Scene();

  // GROUND

  const imageCanvas = document.createElement("canvas");
  const context = imageCanvas.getContext("2d");

  imageCanvas.width = imageCanvas.height = 128;

  context.fillStyle = "#fff";
  context.fillRect(0, 0, 64, 64);
  context.fillRect(64, 64, 64, 64);

  const textureCanvas = new THREE.CanvasTexture(imageCanvas);
  textureCanvas.repeat.set(1000, 1000);
  textureCanvas.wrapS = THREE.RepeatWrapping;
  textureCanvas.wrapT = THREE.RepeatWrapping;

  const materialCanvas = new THREE.MeshBasicMaterial({ map: textureCanvas });

  const geometry = new THREE.PlaneGeometry(100, 150);

  const meshCanvas = new THREE.Mesh(geometry, materialCanvas);
  meshCanvas.rotation.x = -Math.PI / 2;
  meshCanvas.scale.set(1000, 1000, 1000);

  const meshCanvas2 = new THREE.Mesh(geometry, materialCanvas);
  meshCanvas2.rotation.x = -Math.PI / 2;
  meshCanvas2.scale.set(1000, 1000, 1000);

  // PAINTING

  const callbackPainting = function () {
    const image = texturePainting.image;

    scene.add(meshCanvas);
    scene2.add(meshCanvas2);

    const geometry = new THREE.PlaneGeometry(100, 100);
    const mesh = new THREE.Mesh(geometry, materialPainting);
    const mesh2 = new THREE.Mesh(geometry, materialPainting);

    addPainting(scene, mesh);
    addPainting(scene2, mesh2);

    function addPainting(zscene, zmesh) {
      zmesh.scale.x = image.width / 100;
      zmesh.scale.y = image.height / 100;

      zscene.add(zmesh);

      const meshFrame = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      );
      meshFrame.position.z = -10.0;
      meshFrame.scale.x = (1.1 * image.width) / 100;
      meshFrame.scale.y = (1.1 * image.height) / 100;
      zscene.add(meshFrame);

      const meshShadow = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          opacity: 0.75,
          transparent: true,
        })
      );
      meshShadow.position.y = (-1.1 * image.height) / 2;
      meshShadow.position.z = (-1.1 * image.height) / 2;
      meshShadow.rotation.x = -Math.PI / 2;
      meshShadow.scale.x = (1.1 * image.width) / 100;
      meshShadow.scale.y = (1.1 * image.height) / 100;
      zscene.add(meshShadow);

      const floorHeight = (-1.117 * image.height) / 2;
      meshCanvas.position.y = meshCanvas2.position.y = floorHeight;
    }
  };

  const texturePainting = new THREE.TextureLoader().load(
    "AvatarMaker.png",
    callbackPainting
  );
  const materialPainting = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texturePainting,
  });

  //	texturePainting.minFilter = texturePainting.magFilter = THREE.LinearFilter;
  //	texturePainting.mapping = THREE.UVMapping;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.autoClear = false;

  renderer.domElement.style.position = "relative";
  container.appendChild(renderer.domElement);

  document.addEventListener("mousemove", onDocumentMouseMove);
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-(mouseY - 200) - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.clear();
  renderer.setScissorTest(true);

  renderer.setScissor(0, 0, SCREEN_WIDTH / 2 - 2, SCREEN_HEIGHT);
  renderer.render(scene, camera);

  renderer.setScissor(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 - 2, SCREEN_HEIGHT);
  renderer.render(scene2, camera);

  renderer.setScissorTest(false);
}

let camera2, scene3, renderer2;
const mixers = [];

const clock = new THREE.Clock();

init2();
animate2();

function init2() {
  const container2 = document.getElementById("containerr");

  camera2 = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera2.position.set(0, 0, 250);

  scene3 = new THREE.Scene();
  scene3.background = new THREE.Color().setHSL(0.6, 0, 1);
  scene3.fog = new THREE.Fog(scene3.background, 1, 5000);

  // LIGHTS

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  scene3.add(hemiLight);

  //

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  scene3.add(dirLight);

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  const d = 50;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;

  // GROUND

  const groundGeo = new THREE.PlaneGeometry(10000, 10000);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  groundMat.color.setHSL(0.095, 1, 0.75);

  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -33;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene3.add(ground);

  // SKYDOME

  const vertexShader = document.getElementById("vertexShader").textContent;
  const fragmentShader = document.getElementById("fragmentShader").textContent;
  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 },
  };
  uniforms["topColor"].value.copy(hemiLight.color);

  scene3.fog.color.copy(uniforms["bottomColor"].value);

  const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene3.add(sky);

  // MODEL

  const loader = new GLTFLoader();

  loader.load("Flamingo.glb", function (gltf) {
    const mesh3 = gltf.scene.children[0];

    const s = 0.35;
    mesh3.scale.set(s, s, s);
    mesh3.position.y = 15;
    mesh3.position.x = 34;
    mesh3.rotation.y = -1;

    mesh3.castShadow = true;
    mesh3.receiveShadow = true;

    scene3.add(mesh3);

    const mixer = new THREE.AnimationMixer(mesh3);
    mixer.clipAction(gltf.animations[0]).setDuration(1).play();
    mixers.push(mixer);
  });

  // RENDERER

  renderer2 = new THREE.WebGLRenderer({ antialias: true });
  renderer2.setPixelRatio(window.devicePixelRatio);
  renderer2.setSize(window.innerWidth, window.innerHeight);
  container2.appendChild(renderer2.domElement);
  renderer2.outputEncoding = THREE.sRGBEncoding;
  renderer2.shadowMap.enabled = true;

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();

  renderer2.setSize(window.innerWidth, window.innerHeight);
}

//

function animate2() {
  requestAnimationFrame(animate2);

  render2();
}

function render2() {
  const delta = clock.getDelta();

  for (let i = 0; i < mixers.length; i++) {
    mixers[i].update(delta);
  }

  renderer2.render(scene3, camera2);
}
