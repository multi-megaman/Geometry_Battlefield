import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader' //carregar os modelos

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
  
    return parseFloat(str);
}

function addStar(stars_list, scene) {
    const geometry = new THREE.SphereGeometry(0.25,24,24) //(raio_da_esfera,?,?)
    const material = new THREE.MeshStandardMaterial({color: 0xffffff}) //criando o material
    let star;
    // const star = new THREE.Mesh(geometry,material); // juntando a geometria com o material
    const modelLoaderStar = new GLTFLoader();
    modelLoaderStar.load('./models/star/scene.gltf', function(gltf){
      const [x,y,z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread(600) ); //vai criar um numero aleatório entre -100 e 100 e preencher o array com esses numeros
      gltf.scene.position.set(x,y,z); //setando a posição da esfera
      
      const randScale = getRandomFloat(2,10,0);
      gltf.scene.scale.set(randScale,randScale,randScale);
      
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3()); //pega o centro da caixa que foi criada a partir do modelo da estrela (para centralizar ela)
      
      gltf.scene.position.x += (gltf.scene.position.x - center.x);
      gltf.scene.position.y += (gltf.scene.position.y - center.y);
      gltf.scene.position.z += (gltf.scene.position.z - center.z);
      
      star = gltf;
      scene.add(gltf.scene);
      stars_list.push(star);
      // renderer.render(scene,camera);
    })
    
    scene.add(star); //adicionando a esfera a cena
  }

export function generate_stars(scene, starsQtd){
    let stars = [];
    for (let x = 0; x < starsQtd; x++){
        addStar(stars, scene);
    }
    return stars;

}