import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos

// function getRandomFloat(min, max, decimals) {
//     const str = (Math.random() * (max - min) + min).toFixed(decimals);
  
//     return parseFloat(str);
// }

function addpelotitus(pelotitus_list, scene, model_path) {
    const geometry = new THREE.SphereGeometry(0.25,24,24) //(raio_da_esfera,?,?)
    const material = new THREE.MeshStandardMaterial({color: 0xffffff}) //criando o material
    let pelotitus;
    // const pelotitus = new THREE.Mesh(geometry,material); // juntando a geometria com o material
    const modelLoaderpelotitus = new GLTFLoader();
    modelLoaderpelotitus.load(model_path, function(gltf){
      const [x,y,z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread(400) ); //vai criar um numero aleatório entre -100 e 100 e preencher o array com esses numeros
      gltf.scene.position.set(x,0,z); //setando a posição da esfera
      
    //   const randScale = getRandomFloat(2,10,0);
    //   gltf.scene.scale.set(randScale,randScale,randScale);
    gltf.scene.rotateY(THREE.MathUtils.degToRad(y));
      
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3()); //pega o centro da caixa que foi criada a partir do modelo da estrela (para centralizar ela)
      
      gltf.scene.position.x += (gltf.scene.position.x - center.x);
      gltf.scene.position.y += (gltf.scene.position.y - center.y);
      gltf.scene.position.z += (gltf.scene.position.z - center.z);
      
      pelotitus = gltf;
      scene.add(gltf.scene);
      pelotitus_list.push(pelotitus);
      // renderer.render(scene,camera);
    })
    
    scene.add(pelotitus); //adicionando a esfera a cena
  }

export function generate_pelotitus(scene, pelotitusQtd, model_path){
    let pelotitus = [];
    for (let x = 0; x < pelotitusQtd; x++){
        addpelotitus(pelotitus, scene, model_path);
    }
    return pelotitus;

}