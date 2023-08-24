import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //controlar a câmera via mouse
import { A, D, DIRECTIONS, S, W, ACTION, SPACE } from '../utils';
import { normalTexture, angryTexture, superTexture } from '../loaders/load_ballus_textures';
import { RigidBody } from '@dimforge/rapier3d';

export class EnemySpawner {

    position: THREE.Vector3;
    scene: THREE.Scene;
    world: CANNON.World;

    boxGeometry = new THREE.BoxGeometry(20,20,20)
    normalMaterial = new THREE.MeshToonMaterial()
    boxMesh = new THREE.Mesh(this.boxGeometry, this.normalMaterial)

    boxBody: CANNON.Body = new CANNON.Body({ mass: 1 });
    boxShape: CANNON.Box = new CANNON.Box(new CANNON.Vec3(10,10,10))

    constructor (position: THREE.Vector3, scene: THREE.Scene, world: CANNON.World){
        this.position = position;
        this.scene = scene;
        this.world = world;
        this.boxMesh.position.x = -30
        this.boxMesh.position.y = 100
        this.boxMesh.castShadow = true
        this.scene.add(this.boxMesh)
        this.boxBody.linearDamping = 0.25
        this.boxBody.addShape(this.boxShape)
        this.boxBody.position.x = this.boxMesh.position.x
        this.boxBody.position.y = this.boxMesh.position.y
        this.boxBody.position.z = this.boxMesh.position.z
        this.world.addBody(this.boxBody)
    }

    update(){
        this.boxMesh.position.set(
            this.boxBody.position.x,
            this.boxBody.position.y,
            this.boxBody.position.z
          )
          this.boxMesh.quaternion.set(
            this.boxBody.quaternion.x,
            this.boxBody.quaternion.y,
            this.boxBody.quaternion.z,
            this.boxBody.quaternion.w
          )
    }

}