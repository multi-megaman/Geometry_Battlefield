import './style.css';
  import * as THREE from 'three';
import {generate_ballus} from './player/generate_ballus.js';
import { generate_stars } from './generate_stars';
import { BallusController } from './player/ballus_controller';


import { spaceBackground } from './loaders/loadTextureCube';
import { CameraController } from './loaders/load_camera';
import { generate_PointLight,generate_AmbientLight,generate_SpotLight } from './loaders/light_loader';

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

//sempre é necessário 3 passos para criar um render: a cena, a camera e o renderizador 
const scene = new THREE.Scene(); //cria uma cena vazia

const renderer = new THREE.WebGLRenderer({ //cria um renderizador que vai renderizar a cena a cada chamada nova.
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new CameraController(75, window.innerWidth / window.innerHeight, 0.1, 1000, renderer); //cria uma câmera nova na cena

renderer.render(scene,camera.camera);
renderer.shadowMap.enabled = true; //habilita o mapeamento de sombras

//adicionando luzes
generate_PointLight(scene,0xffffff,new THREE.Vector3(100,100,100),1,true);
generate_PointLight(scene,0xffffff,new THREE.Vector3(-100,100,-100),1,true);

// const gridHelper = new THREE.GridHelper(200,50); //cria um plano de auxilio para o dev
// scene.add(gridHelper); //adiciona o gridhelper a cena

const floorGeometry = new THREE.BoxGeometry(256,4,256);
const floorTexture = new THREE.TextureLoader().load(".\\textures\\floors\\checkered_texture.jpg"); //material que vai ser aplicado na geometria
const floor = new THREE.Mesh(floorGeometry,new THREE.MeshStandardMaterial({map: floorTexture})); //a junção da forma geometrica com o material
floor.receiveShadow = true;
floor.position.setX(0);
floor.position.setY(-30); //antes> -12
floor.position.setZ(0);

scene.add(floor)

//função que gera aleatoriamente esferar na cena
let stars : Object[] = [];
stars = generate_stars(scene,150);

//Gerando o personagem principal e seu controlador de movimento e animação 
let ballusModel = await generate_ballus(scene);
let playerController = new BallusController(ballusModel, camera.cameraControls,camera.camera,'Idle');


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

  camera.cameraControls.update(); //atualiza a câmera conforme o movimento do mouse


  renderer.render( scene, camera.camera);
}

animate();