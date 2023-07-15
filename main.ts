import './style.css';
import * as THREE from 'three';
import { generate_stars } from './generate_stars';
import { generate_pelotitus} from './generate_pelotitus';
   
import { RigidBody, World } from '@dimforge/rapier3d';
import {generate_ballus} from './player/generate_ballus.js';
import { BallusController } from './player/ballus_controller';
import { CameraController } from './loaders/load_camera';

import {King_Kube} from './Enemies/King_Kube/king_kube_kontroller';
import { load_king_kube } from './Enemies/King_Kube/king_kube_loader';

import { spaceBackground } from './loaders/loadTextureCube';
import { generate_PointLight,generate_AmbientLight,generate_SpotLight } from './loaders/light_loader';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

//sempre é necessário 3 passos para criar um render: a cena, a camera e o renderizador 

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

//Ajustar o tamanho da janela ao tamanho da tela do usuário
function onWindowResize() {
  camera.camera.aspect = window.innerWidth / window.innerHeight;
  camera.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

//adicionando luzes
// generate_PointLight(scene,0xffffff,new THREE.Vector3(100,200,100),1,true);
generate_PointLight(scene,0xffffff,new THREE.Vector3(0,200,0),1,true);
generate_PointLight(scene,0xffffff,new THREE.Vector3(-100,200,800),1,true);
generate_PointLight(scene,0xffffff,new THREE.Vector3(100,200,800),1,true);
// generate_AmbientLight(scene,0xffffff,new THREE.Vector3(0,100,800),1);

// const gridHelper = new THREE.GridHelper(200,50); //cria um plano de auxilio para o dev
// scene.add(gridHelper); //adiciona o gridhelper a cena


//gerando o Solo
// const floorGeometry = new THREE.BoxGeometry(128,4,128);
// const floorTexture = new THREE.TextureLoader().load(".\\textures\\floors\\checkered_texture.jpg"); //material que vai ser aplicado na geometria
// const floor = new THREE.Mesh(floorGeometry,new THREE.MeshStandardMaterial({map: floorTexture})); //a junção da forma geometrica com o material
// floor.receiveShadow = true;
// floor.position.setX(0);
// floor.position.setY(-12); //antes> -30
// floor.position.setZ(0);

// scene.add(floor)

new GLTFLoader().load('models/Stage1/stage1.gltf', function (gltf) {
  const model = gltf.scene;
  model.position.setY(-10);
  model.traverse(function (object: any) {
      if (object.isMesh) {
        // object.castShadow = true;
        object.receiveShadow = true;
      }
  });
  scene.add(model);
});

//função que gera aleatoriamente esferar na cena
// let stars : GLTF[] = [];
// stars = generate_stars(scene,150);

let male_pelotitus : GLTF[] = [];
male_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/male/pelotitus_male.gltf');

let female_pelotitus : GLTF[] = [];
female_pelotitus = generate_pelotitus(scene,6,'./models/pelotitus/female/pelotitus_female.gltf')

//Gerando o personagem principal e seu controlador de movimento e animação 
let ballusModel = await generate_ballus(scene);
let playerController = new BallusController(ballusModel, camera.cameraControls,camera.camera,'Idle');

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

function animate(){ 
  requestAnimationFrame(animate);

  let updaterDelta = clock.getDelta();
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

  //Como a cena vai ser atualizada estará escrito tudo aqui dentro
  // if (ballus){
  //   ballus.rotation.x += 0.01;
  //   ballus.rotation.y += 0.04;
  //   ballus.rotation.z += 0.08;
  //   camera.lookAt( ballus.position );
  // }


  // if (stars){
  //   let i = 0;
  //   while (i < stars.length) {
  //     stars[i].scene.rotateZ(getRandomFloat(0.01,0.08,4));
  //     stars[i].scene.rotateY(getRandomFloat(0.01,0.08,4));
  //     stars[i].scene.rotateX(getRandomFloat(0.01,0.08,4));
  //     i++;
  // }
  // }
  // mod.rotation.x += 1;

  camera.cameraControls.update(); //atualiza a câmera conforme o movimento do mouse


  renderer.render( scene, camera.camera);
}

animate();