import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos
export async function generate_ballus(scene, world){
    const modelLoader =new GLTFLoader();
    var model;
    model = await modelLoader.loadAsync('./models/ballus/ballus.gltf');
    // model = await modelLoader.loadAsync('./models/pelotitus/male/pelotitus_male.gltf')
    model = model.scene;
    model.position.set(0,100,0);
    // model.scale.set(10,10,10);
    model.traverse( (child) => {
    // if (child.isMesh) child.material = angryTexture;
    if ( child.material ) 
        {child.material.metalness = 0}
    if(child.isMesh) {
        child.castShadow = true
    }
    } );

    //CANNON.JS
    const result = threeToCannon(model, {type: ShapeType.SPHERE});
    const {shape, offset, quaternion} = result;
    const ballusBody = new CANNON.Body({mass: 0});
    ballusBody.addShape(shape, offset, quaternion);
    ballusBody.position.x = model.position.x
    ballusBody.position.y = model.position.y
    ballusBody.position.z = model.position.z

    scene.add(model);
    world.addBody(ballusBody);
    return [model, ballusBody];
}