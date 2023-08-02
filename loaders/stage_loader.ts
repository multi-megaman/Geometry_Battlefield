
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generate_PointLight,generate_AmbientLight,generate_SpotLight } from './light_loader';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';

//adicionando luzes
// generate_PointLight(scene,0xffffff,new THREE.Vector3(-100,200,800),1,true);
// generate_PointLight(scene,0xffffff,new THREE.Vector3(100,200,800),1,true);
// generate_AmbientLight(scene,0xffffff,new THREE.Vector3(0,100,800),1);
export async function load_stage(scene, world){
  
  //Three.JS
  generate_AmbientLight(scene,0xffffff,new THREE.Vector3(0,100,800),1);
  const modelLoader =new GLTFLoader();
  var model;
  model = await modelLoader.loadAsync('models/Stage1/stage1.gltf'); //Stage 1
  model = model.scene;
  model.position.setY(0);
  model.traverse(function (object: any) {
      if (object.isMesh) {
        // object.castShadow = true;
        object.receiveShadow = true;
      }
  });
  
  //CANNON.JS
  const stageMaterial = new CANNON.Material();
  model.traverse((child) => {
    if (child.isMesh) {
      // const body = convertObjectToCannon(child);
      const result = threeToCannon(child, {type: ShapeType.BOX});
      const {shape, offset, quaternion} = result;
      const stageBody = new CANNON.Body({mass: 0, material: stageMaterial});
      stageBody.addShape(shape, offset, quaternion);
      stageBody.position.x = child.position.x
      stageBody.position.y = child.position.y
      stageBody.position.z = child.position.z
      console.log(child.position)
      world.addBody(stageBody);
    }
  });
  
  // world.addBody(stageBody)
  scene.add(model);
  return [model, stageMaterial];
};