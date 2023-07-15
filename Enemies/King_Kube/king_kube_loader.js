import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos

export async function load_king_kube(scene){
    const modelLoader =new GLTFLoader();
    var head;
    var hand1;
    var hand2;

    //Carregando a cabeça do King Kube
    head = await modelLoader.loadAsync('../../models/King_Kube/Kings_head/King_head.gltf');
    head = head.scene;
    // head.scale.set(10,10,10);
    head.traverse( (child) => {
    // if (child.isMesh) child.material = angryTexture;
    if ( child.material ) 
        {child.material.metalness = 0.75}
    if(child.isMesh) {
        child.castShadow = true
    }
    } );
    scene.add(head);
    
    //Carregando a mão do King Kube
    hand1 = await modelLoader.loadAsync('../../models/King_Kube/Kings_hand/King_hand.gltf');
    hand1 = hand1.scene;
    // head.scale.set(10,10,10);
    hand1.traverse( (child) => {
        // if (child.isMesh) child.material = angryTexture;
        if ( child.material ) 
        {child.material.metalness = 0.75}
        if(child.isMesh) {
            child.castShadow = true
        }
    } );
    
    //Carregando a mão do King Kube
    hand2 = await modelLoader.loadAsync('../../models/King_Kube/Kings_hand/King_hand.gltf');
    hand2 = hand2.scene;
    // head.scale.set(10,10,10);
    hand2.traverse( (child) => {
        // if (child.isMesh) child.material = angryTexture;
        if ( child.material )
        {child.material.metalness = 0.75}
        if(child.isMesh) {
            child.castShadow = true
        }
    } );
    
    hand1.position.set(60,-10,20);
    hand2.position.set(-60,-10,20);
    
    head.rotateX(THREE.MathUtils.degToRad(30));
    hand1.rotateX(THREE.MathUtils.degToRad(30));
    hand1.rotateY(THREE.MathUtils.degToRad(-20));
    hand2.rotateX(THREE.MathUtils.degToRad(30));
    hand2.rotateY(THREE.MathUtils.degToRad(20));
    
    head.scale.set(3,3,3);
    hand1.scale.set(0.75,0.75,0.75);
    hand2.scale.set(0.75,0.75,0.75);
    head.add(hand1);
    head.add(hand2);
    
    return head;
}