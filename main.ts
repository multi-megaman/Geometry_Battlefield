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
import { EnemySpawner } from './Enemies/King_Kube/enemy_spawner';

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
// world.solver.iterations = 10;

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


const [fase, materialFase, faseBody]: any = await load_stage(scene, world);

//função que gera aleatoriamente esferar na cena
// let stars : GLTF[] = [];
// stars = generate_stars(scene,150);

// const boxGeometry = new THREE.BoxGeometry(20,20,20)
// const normalMaterial = new THREE.MeshToonMaterial()
// const boxMesh = new THREE.Mesh(boxGeometry, normalMaterial)
// boxMesh.position.x = -30
// boxMesh.position.y = 100
// boxMesh.castShadow = true
// scene.add(boxMesh)
// const boxShape = new CANNON.Box(new CANNON.Vec3(10,10,10))
// const boxBody = new CANNON.Body({ mass: 1 })
// boxBody.linearDamping = 0.25
// boxBody.addShape(boxShape)
// boxBody.position.x = boxMesh.position.x
// boxBody.position.y = boxMesh.position.y
// boxBody.position.z = boxMesh.position.z
// world.addBody(boxBody)

// let male_pelotitus : GLTF[] = [];
// male_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/male/pelotitus_male.gltf');

// let female_pelotitus : GLTF[] = [];
// female_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/female/pelotitus_female.gltf')

//Gerando o personagem principal e seu controlador de movimento e animação 
let ballus: any = await generate_ballus(scene, world);
let ballusModel: THREE.Group = ballus[0];
let ballusBody: CANNON.Body = ballus[1];
let ballusMaterial: CANNON.Material = ballus[2];
let playerController = new BallusController(ballusModel,ballusBody, camera.cameraControls,camera.camera,'Idle', faseBody, world, scene);

//Gerando o King Kube
let king_kube_model = await load_king_kube(scene);
let king_kube = new King_Kube(king_kube_model);
king_kube.model.position.setY(100);
king_kube.model.position.setZ(-350);

//Gerando o Spawner dos inimigos
let enemy_spawner = new EnemySpawner(new THREE.Vector3(0,250,0), scene, world, new CANNON.Vec3(0, 1, 0),new THREE.BoxGeometry(150,0,150));
enemy_spawner.CanUpdate(true);
let enemy_spawner2 =new EnemySpawner(new THREE.Vector3(200,50,0), scene, world, new CANNON.Vec3(1, 0, 0), new THREE.BoxGeometry(0,150,150));
let enemy_spawner3 =new EnemySpawner(new THREE.Vector3(-200,50,0), scene, world, new CANNON.Vec3(-1, 0, 0), new THREE.BoxGeometry(0,150,150));
let enemy_spawner4 =new EnemySpawner(new THREE.Vector3(1,50,200), scene, world, new CANNON.Vec3(0, 0, 1), new THREE.BoxGeometry(150,150,0));
let enemy_spawner5 =new EnemySpawner(new THREE.Vector3(1,50,-200), scene, world, new CANNON.Vec3(0, 0, -1), new THREE.BoxGeometry(150,150,0));
var enemy_spawner_array = [enemy_spawner, enemy_spawner2, enemy_spawner3, enemy_spawner4, enemy_spawner5];

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
  3,
  0.3,
);
composer.addPass( bloomPass );

// const filmPass = new FilmPass(
//   0.01,
//   0.025,
//   648,
//   false,
// );
// composer.addPass( filmPass );

const outputPass = new OutputPass();
composer.addPass( outputPass );

//Trocar de fase
var FaseAtual = 0;
const TempoDasFases = [10,15,20,25,30]

//Display de mortes
const timeDisplay = document.getElementById('time');
const stageDisplay = document.getElementById('stage');
stageDisplay!.innerHTML = "Stage " + (FaseAtual+1).toString();

const clock = new THREE.Clock();
let updaterDelta
//função que será responsável por renderizar cada atualização da cena
function animate(){ 
  // console.log("Tempo para passar da fase atual: " + TempoDasFases[FaseAtual] + " & o tempo atual é: " + playerController.getTimeOnStage())
  requestAnimationFrame(animate);

  updaterDelta = clock.getDelta();
  playerController.updateTimeOnStage(updaterDelta);
  timeDisplay!.innerHTML = playerController.getTimeOnStage().toFixed(1) + "s" + "/" + TempoDasFases[FaseAtual] + "s";
  if (playerController.getTimeOnStage() >= TempoDasFases[FaseAtual]){
    playerController.resetTimeOnStage();
    FaseAtual++;
    
    //Se FaseAtual ultrapassar o tamanho do array, significa que o jogador venceu o jogo e deve ser redirecionado para o html de vitória
    if (FaseAtual >= TempoDasFases.length){
      window.location.href = "victory.html";
    }

    enemy_spawner_array[FaseAtual].CanUpdate(true);

    //Caso seja a fase final (a ultima fase do array) deve printar a mensagem (Stage numero_stage final)
    if (FaseAtual == TempoDasFases.length-1){
      stageDisplay!.innerHTML = "Stage " + (FaseAtual+1).toString() + " final";
    }
    else{
      stageDisplay!.innerHTML = "Stage " + (FaseAtual+1).toString();
    }

    playerController.resetPosition();
  }
  // updaterDelta = Math.min(clock.getDelta(), 0.1)
  world.step(updaterDelta)
  if (playerController){
    playerController.update(updaterDelta,keysPressed, keysReleased)
    king_kube.update(updaterDelta, playerController.model);
    enemy_spawner.update(updaterDelta);
    enemy_spawner2.update(updaterDelta);
    enemy_spawner3.update(updaterDelta);
    enemy_spawner4.update(updaterDelta);
    enemy_spawner5.update(updaterDelta);
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
  // boxMesh.position.set(
  //   boxBody.position.x,
  //   boxBody.position.y,
  //   boxBody.position.z
  // )
  // boxMesh.quaternion.set(
  //   boxBody.quaternion.x,
  //   boxBody.quaternion.y,
  //   boxBody.quaternion.z,
  //   boxBody.quaternion.w
  // )
  // console.log(playerController.body.position)
  camera.cameraControls.update(); //atualiza a câmera conforme o movimento do mouse

  // updatePhysics();

  renderer.render( scene, camera.camera);
  composer.render( updaterDelta );
}

animate();