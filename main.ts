import './style.css';
import * as THREE from 'three';
import {generate_ballus} from './generate_ballus.js';
import { generate_stars } from './generate_stars';
import { BallusController } from './ballus_controller';


import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //controlar a câmera via mouse

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

//rotacionando a câmera via mouse
const controls = new OrbitControls(camera, renderer.domElement); //recebe como parâmetro a propria câmera e o elemento html do renderer, onde fica escutando atualizações com relação ao mouse

//adicionando luzes
const pointLight = new THREE.PointLight(0xffffff,2); //criando um ponto de luz na cena
pointLight.position.set(10,10,10) //movendo o ponto de luz
scene.add(pointLight); //adicionando o ponto de luz na cena
const ambientLight = new THREE.AmbientLight(0xffffff); //criando uma luz ambiente que ilumina tudo na cena
scene.add(ambientLight) //adicionando a luz ambiente na cena

//helpers
// const lightHelper = new THREE.PointLightHelper(pointLight) //cria um helper que mostra na cena onde se localiza o ponto de luz
// scene.add(lightHelper)
// const gridHelper = new THREE.GridHelper(200,50); //cria um plano de auxilio para o dev
// scene.add(gridHelper); //adiciona o gridhelper a cena


//função que gera aleatoriamente esferar na cena
let stars : Object[] = [];
stars = generate_stars(scene,150);

//teste de modelo
var playerController: BallusController;
const modelLoader = new GLTFLoader();
modelLoader.load('./models/ballus/ballus.gltf', function(gltf){
  const model = gltf.scene;
  gltf.scene.scale.set(10,10,10);
  scene.add(model);
  renderer.render(scene,camera);
  playerController = new BallusController(model, controls,camera,'Idle');
})


// const ballus = generate_ballus(scene); //Ballus é o corpo do personagem, e ballus.parent é o rosto dele
//carregar o skybox
const spaceTexture = new THREE.TextureLoader().load('.\\textures\\space.jpg');
scene.background = spaceTexture;

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