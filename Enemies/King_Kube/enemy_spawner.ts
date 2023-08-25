import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class EnemySpawner {

    position: THREE.Vector3;
    scene: THREE.Scene;
    world: CANNON.World;

    boxGeometry = new THREE.BoxGeometry(20,20,20)
    normalMaterial = new THREE.MeshToonMaterial()
    boxMesh = new THREE.Mesh(this.boxGeometry, this.normalMaterial)

    boxBody: CANNON.Body = new CANNON.Body({ mass: 1 });
    boxShape: CANNON.Box = new CANNON.Box(new CANNON.Vec3(10,10,10))

    elapsedTime: number = 0;
    spawnInterval: number = 5; // Intervalo de 5 segundos
    despawnInterval: number = 10; // Intervalo de 10 segundos

    boxes: Array<any> = [];

    constructor (position: THREE.Vector3, scene: THREE.Scene, world: CANNON.World){
        this.position = position;
        this.scene = scene;
        this.world = world;
        // this.boxMesh.position.x = -30
        // this.boxMesh.position.y = 100
        // this.boxMesh.castShadow = true
        // this.scene.add(this.boxMesh)
        // this.boxBody.linearDamping = 0.25
        // this.boxBody.addShape(this.boxShape)
        // this.boxBody.position.x = this.boxMesh.position.x
        // this.boxBody.position.y = this.boxMesh.position.y
        // this.boxBody.position.z = this.boxMesh.position.z
        // this.world.addBody(this.boxBody)
        // this.elapsedTime = 0;
    }

    createBox(){
      // Crie um cubo diferente
      const randomSize = Math.random() * 10 + 10; // Tamanho aleatório entre 10 e 20
      const newBoxGeometry = new THREE.BoxGeometry(randomSize, randomSize, randomSize);
      const newBoxMesh = new THREE.Mesh(newBoxGeometry, this.normalMaterial);

      // Defina a posição inicial do novo cubo (ajuste isso conforme necessário)
      newBoxMesh.position.x = -30;
      newBoxMesh.position.y = 100;
      newBoxMesh.castShadow = true;

      // Adicione o novo cubo à cena
      this.scene.add(newBoxMesh);

      // Crie um novo corpo de física para o novo cubo
      const newBoxBody = new CANNON.Body({ mass: 1 });
      const newBoxShape = new CANNON.Box(new CANNON.Vec3(randomSize / 2, randomSize / 2, randomSize / 2));
      newBoxBody.addShape(newBoxShape);
      // newBoxBody.position.copy(newBoxMesh.position);
      newBoxBody.position.x = newBoxMesh.position.x
      newBoxBody.position.y = newBoxMesh.position.y
      newBoxBody.position.z = newBoxMesh.position.z

      this.world.addBody(newBoxBody);
      this.boxes.push({ mesh: newBoxMesh, body: newBoxBody, despawnTime: 0 })
      console.log("caixa criada")
    }

    updateBoxes(deltaTime){
      //Atualizar a posição e a rotação dos cubos existentes
      if (this.boxes.length > 0){
        this.boxes.forEach((box) => {
          box.mesh.position.set(box.body.position.x, box.body.position.y, box.body.position.z)
          box.mesh.quaternion.set(box.body.quaternion.x, box.body.quaternion.y, box.body.quaternion.z, box.body.quaternion.w)
          box.despawnTime += deltaTime
          if (box.despawnTime >= this.despawnInterval){
            this.scene.remove(box.mesh)
            this.world.removeBody(box.body)
            this.boxes.splice(this.boxes.indexOf(box),1)
            console.log("caixa removida")
          }
        });
      }
    }

    update(deltaTime: number) {
      // Atualize o contador de tempo
      this.elapsedTime += deltaTime;
  
      // Verifique se o tempo passou do intervalo de spawn
      if (this.elapsedTime >= this.spawnInterval) {
        // Redefina o contador de tempo
        this.elapsedTime = 0;
        this.createBox();
      }

      this.updateBoxes(deltaTime);
      
      // // Atualize a posição e a rotação do cubo existente
      // this.boxMesh.position.set(this.boxBody.position.x, this.boxBody.position.y, this.boxBody.position.z);
      // this.boxMesh.quaternion.set(this.boxBody.quaternion.x, this.boxBody.quaternion.y, this.boxBody.quaternion.z, this.boxBody.quaternion.w);
    }

}