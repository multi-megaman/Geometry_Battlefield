import './style.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { generate_stars } from './generate_stars';
import { generate_pelotitus} from './generate_pelotitus';
   
import { RigidBody, World } from '@dimforge/rapier3d';
import {generate_ballus} from './player/generate_ballus.js';
import { BallusController } from './player/ballus_controller';
import { CameraController } from './loaders/load_camera';

import {King_Kube} from './Enemies/King_Kube/king_kube_kontroller';
import { load_king_kube } from './Enemies/King_Kube/king_kube_loader';

import { spaceBackground } from './loaders/loadTextureCube';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { load_stage } from './loaders/stage_loader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// camera.position.z = 2;


//iniciando a fisica
var timeStep=1/60; // segundos
let world = new CANNON.World();
world.gravity.set(0,-200,0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

//Iniciando o ThreeJS

//Cena
const scene = new THREE.Scene(); //cria uma cena vazia

//Renderizador
const renderer = new THREE.WebGLRenderer({ //cria um renderizador que vai renderizar a cena a cada chamada nova.
  canvas: document.querySelector('#bg') as HTMLCanvasElement
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Camera
var camera = new CameraController(75, window.innerWidth / window.innerHeight, 0.1, 1000, renderer); //cria uma câmera nova na cena

renderer.render(scene,camera.camera);
renderer.shadowMap.enabled = true; //habilita o mapeamento de sombras

//Ajuste de tamanho da janela
function onWindowResize() {
  camera.camera.aspect = window.innerWidth / window.innerHeight;
  camera.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);


const [fase, materialFase, faseBody] = await load_stage(scene, world);
console.log(fase)
console.log(materialFase)
console.log(faseBody)

//função que gera aleatoriamente esferar na cena
// let stars : GLTF[] = [];
// stars = generate_stars(scene,150);

const sphereGeometry = new THREE.SphereGeometry(10)
const normalMaterial = new THREE.MeshNormalMaterial()
const sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial)
sphereMesh.position.x = -30
sphereMesh.position.y = 100
sphereMesh.castShadow = true
scene.add(sphereMesh)
const sphereShape = new CANNON.Sphere(5)
const sphereBody = new CANNON.Body({ mass: 1 })
sphereBody.linearDamping = 0.25
sphereBody.addShape(sphereShape)
sphereBody.position.x = sphereMesh.position.x
sphereBody.position.y = sphereMesh.position.y
sphereBody.position.z = sphereMesh.position.z
world.addBody(sphereBody)

let male_pelotitus : GLTF[] = [];
male_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/male/pelotitus_male.gltf');

let female_pelotitus : GLTF[] = [];
female_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/female/pelotitus_female.gltf')

//Gerando o personagem principal e seu controlador de movimento e animação 
let ballus = await generate_ballus(scene, world);
let ballusModel: THREE.Group = ballus[0];
let ballusBody: CANNON.Body = ballus[1];
let ballusMaterial: CANNON.Material = ballus[2];
let playerController = new BallusController(ballusModel,ballusBody, camera.cameraControls,camera.camera,'Idle', faseBody, world);

//Gerando o King Kube
let king_kube_model = await load_king_kube(scene);
let king_kube = new King_Kube(king_kube_model);
king_kube.model.position.setY(250);
king_kube.model.position.setZ(-350);

scene.background = spaceBackground;
scene.environment = spaceBackground;


//Como a colisão entre o Ballus e o mundo deve ocorrer:
const colisaoBallusMundo = new CANNON.ContactMaterial(
  ballusMaterial,
  materialFase,
  {friction: 1}
);
//Função que gerencia os controles de movimentação:
const keysPressed = {};
document.addEventListener('keydown', (event) => {
  if (event.shiftKey && playerController){
    playerController.toggleRun();
  }
  else{
    (keysPressed as any)[event.key.toLocaleLowerCase()] = true  
  }
}, false);
document.addEventListener('keyup', (event) => {
  (keysPressed as any)[event.key.toLocaleLowerCase()] = false  
}, false);

const keysReleased = {};
document.addEventListener('keyup', (event) => {
    (keysReleased as any)[event.key.toLocaleLowerCase()] = true  
}, false);
document.addEventListener('keydown', (event) => {
  (keysReleased as any)[event.key.toLocaleLowerCase()] = false  
}, false);


//Pós processamento

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera.camera ) );

const bloomPass = new BloomPass(
  0.5,
  10,
  0.4,
);
composer.addPass( bloomPass );

const filmPass = new FilmPass(
  0.35,
  0.025,
  648,
  false,
);
composer.addPass( filmPass );

const outputPass = new OutputPass();
composer.addPass( outputPass );



const clock = new THREE.Clock();
let updaterDelta
//função que será responsável por renderizar cada atualização da cena
function animate(){ 

  requestAnimationFrame(animate);

  updaterDelta = clock.getDelta();
  // updaterDelta = Math.min(clock.getDelta(), 0.1)
  world.step(updaterDelta)
  if (playerController){
    playerController.update(updaterDelta,keysPressed, keysReleased)
    king_kube.update(updaterDelta, playerController.model);
    // if (playerController.getRun()){
    //   model.traverse( (child) => { if (child.isMesh) child.material = angryTexture; })
    // }
    // else{
    //   model.traverse( (child) => { if (child.isMesh) child.material = normalTexture; })
    // }
  }
  // updatePhysics();
  // if (stars){
  //   let i = 0;
  //   while (i < stars.length) {
  //     stars[i].scene.rotateZ(getRandomFloat(0.01,0.08,4));
  //     stars[i].scene.rotateY(getRandomFloat(0.01,0.08,4));
  //     stars[i].scene.rotateX(getRandomFloat(0.01,0.08,4));
  //     i++;
  // }
  // 
  sphereMesh.position.set(
    sphereBody.position.x,
    sphereBody.position.y,
    sphereBody.position.z
  )
  sphereMesh.quaternion.set(
    sphereBody.quaternion.x,
    sphereBody.quaternion.y,
    sphereBody.quaternion.z,
    sphereBody.quaternion.w
  )
  // console.log(playerController.body.position)
  camera.cameraControls.update(); //atualiza a câmera conforme o movimento do mouse

  // updatePhysics();

  renderer.render( scene, camera.camera);
  composer.render( updaterDelta );
}

animate();