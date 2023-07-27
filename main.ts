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



//iniciando a fisica
var timeStep=1/60; // segundos
let world = new CANNON.World();
world.gravity.set(0,-9.82,0);
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


const fase = await load_stage(scene, world);

//função que gera aleatoriamente esferar na cena
// let stars : GLTF[] = [];
// stars = generate_stars(scene,150);

let male_pelotitus : GLTF[] = [];
male_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/male/pelotitus_male.gltf');

let female_pelotitus : GLTF[] = [];
female_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/female/pelotitus_female.gltf')

//Gerando o personagem principal e seu controlador de movimento e animação 
let ballus = await generate_ballus(scene, world);
let ballusModel: THREE.Group = ballus[0];
let ballusBody: CANNON.Body = ballus[1];
let playerController = new BallusController(ballusModel,ballusBody, camera.cameraControls,camera.camera,'Idle');

//Gerando o King Kube
let king_kube_model = await load_king_kube(scene);
let king_kube = new King_Kube(king_kube_model);
king_kube.model.position.setY(250);
king_kube.model.position.setZ(-350);

scene.background = spaceBackground;
scene.environment = spaceBackground;

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

//função que será responsável por renderizar cada atualização da cena
const clock = new THREE.Clock();

function updatePhysics() {

  // Step the physics world
  world.step(timeStep);


}
let updaterDelta
function animate(){ 

  requestAnimationFrame(animate);

  updaterDelta = clock.getDelta();
  // updaterDelta = Math.min(clock.getDelta(), 0.1)
  world.step(updaterDelta)
  if (playerController){
    playerController.update(updaterDelta,keysPressed)
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

  camera.cameraControls.update(); //atualiza a câmera conforme o movimento do mouse

  // updatePhysics();

  renderer.render( scene, camera.camera);
}

animate();