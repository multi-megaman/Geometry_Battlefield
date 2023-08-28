
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generate_PointLight,generate_AmbientLight,generate_SpotLight } from './light_loader';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';

//adicionando luzes
// generate_AmbientLight(scene,0xffffff,new THREE.Vector3(0,100,800),1);
export async function load_stage(scene, world){
  
  //Three.JS
  generate_PointLight(scene,0xffffff,new THREE.Vector3(-100,200,200),2,true);
  generate_PointLight(scene,0xffffff,new THREE.Vector3(100,200,200),2,true);
  generate_PointLight(scene,0xffffff,new THREE.Vector3(-100,200,-200),2,true);
  generate_PointLight(scene,0xffffff,new THREE.Vector3(100,200,-200),2,true);
  // // generate_AmbientLight(scene,0xffffff,new THREE.Vector3(0,100,800),1);
  // const modelLoader =new GLTFLoader();
  // var model;
  // model = await modelLoader.loadAsync('models/Stage1/stage1.gltf'); //Stage 1
  // model = model.scene;
  // model.position.setY(0);
  // model.traverse(function (object: any) {
  //     if (object.isMesh) {
  //       // object.castShadow = true;
  //       object.receiveShadow = true;
  //     }
  // });

  //gerando o modelo do palco a partir de uma box no three.js
  const stageGeometry = new THREE.BoxGeometry(100, 1, 100);
  const loader = new THREE.TextureLoader();
  const stageModelMaterial = new THREE.MeshToonMaterial( { map: loader.load("../textures/kubiku/front2.png") } );
  // const stageModelMaterial = new THREE.MeshToonMaterial({color: 0xffff00});
  const model = new THREE.Mesh(stageGeometry, stageModelMaterial);
  model.castShadow = true;
  model.receiveShadow = true;
  
  //CANNON.JS
  const stageMaterial = new CANNON.Material();
  // model.traverse((child) => {
  //   if (child.isMesh) {b
      // const body = convertObjectToCannon(child);
    const result = threeToCannon(model, {type: ShapeType.BOX});
    const {shape, offset, quaternion} = result;
    // console.log(shape)
    // console.log(offset)
    // console.log(quaternion)
    const stageBody = new CANNON.Body({mass: 0, material: stageMaterial});
    stageBody.addShape(shape, offset, quaternion);
    stageBody.position.x = model.position.x
    stageBody.position.y = model.position.y
    stageBody.position.z = model.position.z
    // console.log(model.position)
    world.addBody(stageBody);
    // }
  // });
  
  // world.addBody(stageBody)
  scene.add(model);
  // console.log(stageBody)
  // return [model, stageMaterial, stageBody];
  return [model, stageMaterial, stageBody]
};