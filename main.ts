import './style.css';
import * as THREE from 'three';
import {generate_ballus} from './player/generate_ballus.js';
import { generate_stars } from './generate_stars';
import { BallusController } from './player/ballus_controller';


import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //controlar a câmera via mouse

import { spaceBackground } from './loaders/loadTextureCube';

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

//sempre é necessário 3 passos para criar um render: a cena, a camera e o renderizador 
const scene = new THREE.Scene(); //cria uma cena vazia

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //cria uma câmera nova na cena

const renderer = new THREE.WebGLRenderer({ //cria um renderizador que vai renderizar a cena a cada chamada nova.
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene,camera);
renderer.shadowMap.enabled = true;

//rotacionando a câmera via mouse
const controls = new OrbitControls(camera, renderer.domElement); //recebe como parâmetro a propria câmera e o elemento html do renderer, onde fica escutando atualizações com relação ao mouse
controls.enableRotate = true; // Habilitar rotação
controls.autoRotate = true; // Habilitar rotação automática
controls.enableDamping = true; //habilita o damping, que é a inércia do movimento do mouse
controls.dampingFactor = 0.05; //quanto maior o dampingfactor, mais lento o damping
controls.enableZoom = true; //desabilita o zoom
controls.maxDistance = 110; //distância máxima que a câmera pode se afastar
controls.minDistance = 50; //distância mínima que a câmera pode se aproximar
//adicionando luzes
const pointLight = new THREE.PointLight(0xffffff,1); //criando um ponto de luz na cena
pointLight.position.set(100,100,100) //movendo o ponto de luz
scene.add(pointLight); //adicionando o ponto de luz na cena
pointLight.castShadow = true;

const pointLight2 = new THREE.PointLight(0xffffff,1); //criando um ponto de luz na cena
pointLight2.position.set(-100,100,-100) //movendo o ponto de luz
scene.add(pointLight2); //adicionando o ponto de luz na cena
pointLight2.castShadow = true;

// const pointLight3 = new THREE.PointLight(0xffffff,1); //criando um ponto de luz na cena
// pointLight3.position.set(-100,100,100) //movendo o ponto de luz
// scene.add(pointLight3); //adicionando o ponto de luz na cena
// pointLight3.castShadow = true;

// const pointLight4 = new THREE.PointLight(0xffffff,1); //criando um ponto de luz na cena
// pointLight4.position.set(100,100,-100) //movendo o ponto de luz
// scene.add(pointLight4); //adicionando o ponto de luz na cena
// pointLight4.castShadow = true;
// helpers
const lightHelper = new THREE.PointLightHelper(pointLight) //cria um helper que mostra na cena onde se localiza o ponto de luz
scene.add(lightHelper)
const lightHelper2 = new THREE.PointLightHelper(pointLight2) //cria um helper que mostra na cena onde se localiza o ponto de luz
scene.add(lightHelper2)
// const lightHelper3 = new THREE.PointLightHelper(pointLight3) //cria um helper que mostra na cena onde se localiza o ponto de luz
// scene.add(lightHelper3)
// const lightHelper4 = new THREE.PointLightHelper(pointLight4) //cria um helper que mostra na cena onde se localiza o ponto de luz
// scene.add(lightHelper4)
// const ambientLight = new THREE.AmbientLight(0xffffff); //criando uma luz ambiente que ilumina tudo na cena
// ambientLight.castShadow = true;
// scene.add(ambientLight) //adicionando a luz ambiente na cena

// const gridHelper = new THREE.GridHelper(200,50); //cria um plano de auxilio para o dev
// scene.add(gridHelper); //adiciona o gridhelper a cena

const floorGeometry = new THREE.BoxGeometry(256,4,256);
const floorTexture = new THREE.TextureLoader().load(".\\textures\\floors\\checkered_texture.jpg"); //material que vai ser aplicado na geometria
const floor = new THREE.Mesh(floorGeometry,new THREE.MeshStandardMaterial({map: floorTexture})); //a junção da forma geometrica com o material
floor.receiveShadow = true;
floor.position.setX(0);
floor.position.setY(-12);
floor.position.setZ(0);

scene.add(floor)

//função que gera aleatoriamente esferar na cena
let stars : Object[] = [];
stars = generate_stars(scene,150);

//teste de modelo
var playerController: BallusController;




let ballusModel = await generate_ballus(scene);
playerController = new BallusController(ballusModel, controls,camera,'Idle');


// const ballus = generate_ballus(scene); //Ballus é o corpo do personagem, e ballus.parent é o rosto dele
//carregar o skybox
// const spaceTexture = new THREE.TextureLoader().load('.\\textures\\space.jpg');

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


  if (stars){
    let i = 0;
    while (i < stars.length) {
      stars[i].scene.rotateZ(getRandomFloat(0.01,0.08,4));
      stars[i].scene.rotateY(getRandomFloat(0.01,0.08,4));
      stars[i].scene.rotateX(getRandomFloat(0.01,0.08,4));
      i++;
  }
  }
  // mod.rotation.x += 1;

  controls.update(); //atualiza a câmera conforme o movimento do mouse


  renderer.render( scene, camera);
}

animate();