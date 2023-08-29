import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos

export async function generate_ballus(scene, world){
    //THREE.JS
    const modelLoader =new GLTFLoader();
    var model;
    model = await modelLoader.loadAsync('./models/ballus/ballus.gltf');
    // model = await modelLoader.loadAsync('./models/pelotitus/male/pelotitus_male.gltf')
    model = model.scene;
    // model.scale.set(0,0,0);
    model.position.set(0,400,0);
    // model.scale.set(10,10,10);
    model.traverse( (child) => {
    // if (child.isMesh) child.material = angryTexture;
    if ( child.material ) 
        {child.material.metalness = 0}
    if(child.isMesh) {
        child.castShadow = true
    }
    } );

    // //Criando uma esfera e aplicando a textura do ballus a ela
    // const geometry = new THREE.SphereGeometry( 10, 32, 32 );
    // const material = new THREE.MeshToonMaterial( {color: 0xffff00} );
    // const model = new THREE.Mesh( geometry, material );

    //CANNON.JS
    const ballusMaterial = new CANNON.Material();
    const result = threeToCannon(model, {type: ShapeType.SPHERE});
    const {shape, offset, quaternion} = result;
    const ballusBody = new CANNON.Body({mass: 1, material: ballusMaterial});
    ballusBody.addShape(shape, offset, quaternion);
    ballusBody.position.x = model.position.x
    ballusBody.position.y = model.position.y
    ballusBody.position.z = model.position.z
    ballusBody.linearDamping = 0.25;
    ballusBody.angularDamping = 1;

    scene.add(model);
    world.addBody(ballusBody);
    return [model, ballusBody, ballusMaterial];
}