import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //controlar a câmera via mouse
import { A, D, DIRECTIONS, S, W, ACTION } from '../utils';
import { normalTexture, angryTexture, superTexture } from '../loaders/load_ballus_textures';
import { RigidBody } from '@dimforge/rapier3d';

export class BallusController {
    
    model: THREE.Group
    orbitControls: OrbitControls;
    camera : THREE.Camera;

    //CANNON.JS
    body: CANNON.Body;

    run: boolean = false;
    super: boolean = false;
    currentAction: string;
    
    //Temporary data
    walkDirection = new THREE.Vector3();
    rotateAngle = new THREE.Vector3(0,1,0);
    rollAngle = new THREE.Vector3(1,0,0);
    rotateQuarternion: THREE.Quaternion = new THREE.Quaternion();
    cameraTarget = new THREE.Vector3();

    //Constants
    normalRunVelocity = 120;
    normalWalkVelocity = 60;
    superRunVelocity = 480;
    superWalkVelocity = 240;
    runVelocity = this.normalRunVelocity;
    walkVelocity = this.normalWalkVelocity;
    
    superRoll = 1;
    fastRoll = 0.5;
    slowRoll = 0.3;

    constructor(model: THREE.Group,body:CANNON.Body, orbitControls: OrbitControls, camera:THREE.Camera, currentAction: string, ){
        this.model = model;
        this.body = body;

        this.orbitControls = orbitControls;
        this.camera = camera;
        this.currentAction = currentAction;
        this.updateCameraTarget(0,0);
    }

    public toggleRun() {
        this.run = !this.run;
    }

    public toggleSuper() {
        this.super = !this.super;
    }

    public getRun(){
        return this.run;
    }

    public update (delta : number, keysPressed: any){
        this.model.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
        // this.camera.position.x = this.model.position.x;
        // this.camera.position.add(new THREE.Vector3(0, 5, 10)); // Ajuste a distância da câmera em relação ao objeto
        this.camera.lookAt(this.model.position);
    }

    private updateCameraTarget(moveX: number, moveZ: number) { //faz o update da câmera baseado no movimento do personagem
        // move a câmera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // atualiza o alvo da câmera, ou seja, para quem a câmera está olhando
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 20
        this.cameraTarget.z = this.model.position.z
        this.orbitControls.target = this.cameraTarget
    }

    private directionOffset(keysPressed: any) { //calcular o offset pra onde o personágem deve virar dependendo dos botões pressionados
        var directionOffset = 0 // w

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed[D]) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed[D]) {
            directionOffset = - Math.PI / 2 // d
        }

        // var directionOffset = Math.PI // w

        // if (keysPressed[W]) {
        //     if (keysPressed[A]) {
        //         directionOffset = -Math.PI / 4 - Math.PI / 2 // w+a
        //     } else if (keysPressed[D]) {
        //         directionOffset = Math.PI / 4 + Math.PI / 2 // w+d
        //     }
        // } else if (keysPressed[S]) {
        //     if (keysPressed[A]) {
        //         directionOffset = - Math.PI / 4   // s+a
        //     } else if (keysPressed[D]) {
        //         directionOffset =   Math.PI / 4   // s+d
        //     } else {
        //         directionOffset = 0 // s
        //     }
        // } else if (keysPressed[A]) {
        //     directionOffset = - Math.PI / 2 // a
        // } else if (keysPressed[D]) {
        //     directionOffset =  Math.PI / 2 // d
        // }

        return directionOffset
    }

    private changeTexture(texture){
        this.model.traverse((child) => {
            if (child.isMesh){
                child.material = texture;
            }
        })
    }
}