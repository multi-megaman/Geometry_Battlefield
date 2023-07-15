import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos
export async function generate_ballus(scene){
    const modelLoader =new GLTFLoader();
    var model;
    model = await modelLoader.loadAsync('./models/ballus/ballus.gltf');
    // model = await modelLoader.loadAsync('./models/pelotitus/male/pelotitus_male.gltf')
    model = model.scene;
    // model.scale.set(10,10,10);
    model.traverse( (child) => {
    // if (child.isMesh) child.material = angryTexture;
    if ( child.material ) 
        {child.material.metalness = 0}
    if(child.isMesh) {
        child.castShadow = true
    }
    } );
    scene.add(model);
    return model;
    // let ballus_body;
    // let ballus_face;
    // const ballus_size = 10;
    // const ballusFormat = new THREE.SphereGeometry(ballus_size,64,64);
    // const ballusFaceFormat = new THREE.SphereGeometry(ballus_size+0.25,64,64);
    // const ballusBodyTexture = new THREE.TextureLoader().load(".\\textures\\ballus_backup.png"); //material que vai ser aplicado na geometria
    // const ballusFaceTexture = new THREE.TextureLoader().load(".\\textures\\Ballus_face.png"); //material que vai ser aplicado na geometria
    // // const MoonNormal = new THREE.TextureLoader().load(".\\textures\\normal.jpg"); // textura normal para dar a ilusão de profundidade na textura padrão
    
    // ballus_body = new THREE.Mesh(ballusFormat,new THREE.MeshStandardMaterial({map: ballusBodyTexture}),); //a junção da forma geometrica com o material
    // ballus_body.castShadow = true;
    // ballus_face = new THREE.Mesh(ballusFaceFormat,new THREE.MeshStandardMaterial({map: ballusFaceTexture, transparent: true })); //a junção da forma geometrica com o material
    // ballus_face.castShadow = true;
    // scene.add(ballus_face); //adicionando a forma a cena
    // ballus_face.add(ballus_body)

    // return ballus_body;
}