import * as THREE from 'three';

export function generate_ballus(scene){
    let ballus_body;
    let ballus_face;
    const ballus_size = 10;
    const ballusFormat = new THREE.SphereGeometry(ballus_size,64,64);
    const ballusFaceFormat = new THREE.SphereGeometry(ballus_size+0.25,64,64);
    const ballusBodyTexture = new THREE.TextureLoader().load(".\\textures\\ballus_backup.png"); //material que vai ser aplicado na geometria
    const ballusFaceTexture = new THREE.TextureLoader().load(".\\textures\\Ballus_face.png"); //material que vai ser aplicado na geometria
    // const MoonNormal = new THREE.TextureLoader().load(".\\textures\\normal.jpg"); // textura normal para dar a ilusão de profundidade na textura padrão
    
    ballus_body = new THREE.Mesh(ballusFormat,new THREE.MeshStandardMaterial({map: ballusBodyTexture})); //a junção da forma geometrica com o material
    ballus_face = new THREE.Mesh(ballusFaceFormat,new THREE.MeshStandardMaterial({map: ballusFaceTexture, transparent: true })); //a junção da forma geometrica com o material
    scene.add(ballus_face); //adicionando a forma a cena
    ballus_face.add(ballus_body)

    return ballus_body;
}