import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //controlar a câmera via mouse
import { A, D, DIRECTIONS, S, W, ACTION, SPACE } from '../utils';
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
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true) //qualquer botão de movimento ser pressionado
        var directionOffset
        let moveX = 0
        let moveZ = 0
        let moveY = 0

        if (directionPressed){ //se move para frente
            // velocidade de rolamento e de corrida
            const velocity = this.run ? this.runVelocity : this.walkVelocity
            var roll = this.run ? this.fastRoll : this.slowRoll
            roll = this.super ? this.superRoll : roll
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

                // Calculando a direção do movimento
                this.camera.getWorldDirection(this.walkDirection)
                this.walkDirection.y = 0
                this.walkDirection.normalize()
                this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)
                
                
                // com todos os dados calculados, movemos Ballus
                moveX = this.walkDirection.x * velocity * delta
                moveZ = this.walkDirection.z * velocity * delta
                this.body.position.x += moveX
                this.body.position.z += moveZ
                // moveY = (this.model.position.y - this.body.position.y) * delta
                // this.model.position.x = this.body.position.x
                // this.model.position.z = this.body.position.z
                // this.model.position.y = this.body.position.y
                
                
            }
            
            //Parte do pulo
            if (keysPressed[SPACE] == true){
                this.body.applyImpulse(new CANNON.Vec3(0, 25, 0), new CANNON.Vec3(0, 0, 0))
            }

            this.updateCameraTarget(moveX, moveZ, moveY)
            
            this.model.position.copy(this.body.position)
            
            //update Ballus texture
            if (this.run){
                this.changeTexture(angryTexture)
            }
            else {
                this.changeTexture(normalTexture)
            }

            //change to Super Ballus
            if (keysPressed[ACTION] == true){
                this.toggleSuper()
            }

            //if super
            if (this.super){
                this.changeTexture(superTexture)
                this.runVelocity = this.superRunVelocity;
                this.walkVelocity = this.superWalkVelocity;
            }
            else{
                this.runVelocity = this.normalRunVelocity;
                this.walkVelocity = this.normalWalkVelocity;
            }
    }
    
    private updateCameraTarget(moveX: number, moveZ: number, moveY: number) { //faz o update da câmera baseado no movimento do personagem
        // move a câmera
        // this.camera.position.x += moveX
        // this.camera.position.z += moveZ
        // this.camera.position.y += moveY
        this.camera.position.y = this.model.position.y + 100

        // atualiza o alvo da câmera, ou seja, para quem a câmera está olhando
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 50
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