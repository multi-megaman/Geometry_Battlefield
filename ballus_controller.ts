import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //controlar a câmera via mouse
import * as THREE from 'three';
import { A, D, DIRECTIONS, S, W } from './utils';

export class BallusController {
    
    model: THREE.Group
    orbitControls: OrbitControls;
    camera : THREE.Camera;

    run: boolean = false;
    currentAction: string;
    
    //Temporary data
    walkDirection = new THREE.Vector3();
    rotateAngle = new THREE.Vector3(0,1,0);
    rollAngle = new THREE.Vector3(1,0,0);
    rotateQuarternion: THREE.Quaternion = new THREE.Quaternion();
    cameraTarget = new THREE.Vector3();


    //Constants
    runVelocity = 120;
    walkVelocity = 60;
    fastRoll = 0.5;
    slowRoll = 0.3;


    constructor(model: THREE.Group,orbitControls: OrbitControls, camera:THREE.Camera, currentAction: string){
        this.model = model;
        this.orbitControls = orbitControls;
        this.camera = camera;
        this.currentAction = currentAction;
        this.updateCameraTarget(0,0);
    }


    public toggleRun() {
        this.run = !this.run;
    }

    public getRun(){
        return this.run;
    }

    public update (delta : number, keysPressed: any){
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true) //qualquer botão de movimento ser pressionado
        var directionOffset
        if (directionPressed){ //se move para frente
            // run/walk velocity
            const velocity = this.run ? this.runVelocity : this.walkVelocity
            const roll = this.run ? this.fastRoll : this.slowRoll
            //calcula o angulo da câmera 
            var angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
                )
                //calculo do offset do movimento diagonal
                directionOffset = this.directionOffset(keysPressed)
                
                //Fazendo a devida rotação
                this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset);
                this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2); //estamos rotacionando o Ballus
                this.model.rotateX(-roll) //efeito de rolar para frente
                // calculate direction
                this.camera.getWorldDirection(this.walkDirection)
                this.walkDirection.y = 0
                this.walkDirection.normalize()
                this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)
                
                
                // move model & camera
                const moveX = this.walkDirection.x * velocity * delta
                const moveZ = this.walkDirection.z * velocity * delta
                this.model.position.x += moveX
                this.model.position.z += moveZ
                this.updateCameraTarget(moveX, moveZ)
                
                
            }

        //aqui que pode ser atualizadas as animações do modelo dependendo do botão selecionado.
    }

    private updateCameraTarget(moveX: number, moveZ: number) { //faz o update da câmera baseado no movimento do personagem
        // move camera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
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
}