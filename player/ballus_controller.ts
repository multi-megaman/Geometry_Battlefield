import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //controlar a câmera via mouse
import { A, D, DIRECTIONS, S, W, ACTION, SPACE } from '../utils';
import { normalTexture, angryTexture, superTexture } from '../loaders/load_ballus_textures';
import { RigidBody } from '@dimforge/rapier3d';

export class BallusController {
    lifes: number = 0;
    lifesDisplay = document.getElementById('lifes');
    timeOnStage: number = 0;
    model: THREE.Group
    orbitControls: OrbitControls;
    stageBody: CANNON.Body;
    world: CANNON.World;
    camera : THREE.Camera;
    scene: THREE.Scene;
    jumping: boolean = false;
    canJump: boolean = true;
    jumpStartTime: number = 0;
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
    maxJumpDuration = 0.33;

    normalRunVelocity = 120;
    normalWalkVelocity = 60;
    superRunVelocity = 480;
    superWalkVelocity = 240;
    runVelocity = this.normalRunVelocity;
    walkVelocity = this.normalWalkVelocity;
    
    superRoll = 1;
    fastRoll = 0.5;
    slowRoll = 0.3;

    constructor(model: THREE.Group,body:CANNON.Body, orbitControls: OrbitControls, camera:THREE.Camera, currentAction: string, stageBody: CANNON.Body, world: CANNON.World, scene: THREE.Scene ){
        this.model = model;
        this.body = body;
        this.stageBody = stageBody;
        this.world = world;
        this.scene = scene;
        this.lifesDisplay!.innerHTML = String(this.lifes);
        this.orbitControls = orbitControls;
        this.camera = camera;
        this.currentAction = currentAction;
        this.updateCameraTarget(0,0,0);

        // // Carregue a textura do coração
        // var heartTexture = new THREE.TextureLoader().load('../textures/lifes.png');

        // // Crie o material do sprite
        // var heartMaterial = new THREE.SpriteMaterial({
        //     map: heartTexture,
        //     color: 0xffffff, // Cor do coração
        // });

        // // Crie um sprite para cada coração
        // var heartSprite1 = new THREE.Sprite(heartMaterial);
        // var heartSprite2 = new THREE.Sprite(heartMaterial);
        // var heartSprite3 = new THREE.Sprite(heartMaterial);

        // // Posicione os sprites no canto superior esquerdo
        // heartSprite1.position.set(-10, 10, 0);
        // heartSprite2.position.set(10, 10, 0);
        // heartSprite3.position.set(30, 10, 0);

        // // Adicione os sprites à cena
        // this.scene.add(heartSprite1);
        // this.scene.add(heartSprite2);
        // this.scene.add(heartSprite3);
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

    public updateTimeOnStage(delta: number){
        this.timeOnStage += delta;
    }

    public getTimeOnStage(){
        return this.timeOnStage;
    }

    public resetPosition(){
        this.model.position.x = 0;
        this.model.position.y = 400;
        this.model.position.z = 0;
        this.body.position.x = 0;
        this.body.position.y = 400;
        this.body.position.z = 0;
        this.body.force.set(0, 0, 0);
        this.body.torque.set(0,0,0);
        this.body.angularVelocity.set(0,0,0);
        this.body.inertia.set(0,0,0);
        this.body.applyImpulse(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, 0, 0))
        this.body.velocity.set(0,0,0);
    }

    public resetTimeOnStage(){
        this.timeOnStage = 0;
    }

    private CheckLoseLife(){
        if (this.model.position.y < -100){
            this.lifes += 1;
            this.lifesDisplay!.innerHTML = String(this.lifes);
            this.resetTimeOnStage();
            this.resetPosition();
        }
    }

    public update (delta : number, keysPressed: any, keysReleased: any){
        
        
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
                if (this.canJump){
                    if (!this.jumping){
                        this.jumping = true;
                        this.jumpStartTime = performance.now();
                    }
                }
                if (this.jumping){
                    const jumpDuration = (performance.now() - this.jumpStartTime) / 1000;
                    if (jumpDuration > this.maxJumpDuration){
                        this.jumping = false;
                        this.canJump = false;
                        // console.log("O pulo acabou")
                    }
                    this.body.applyImpulse(new CANNON.Vec3(0, 10, 0), new CANNON.Vec3(0, 0, 0))
                }
            }
            if (keysReleased[SPACE] == true){
                this.jumping = false;
                this.canJump = false;
                // console.log("O pulo acabou")
                keysReleased[SPACE] = false;
            }

            var results = [];
            //Checando para ver se houve um contato entre o Ballus e o StageBody
            this.world.narrowphase.getContacts([this.body], [this.stageBody], this.world, results, [], [], []);
            // console.log(results)

            if (results.length <= 0){
                this.canJump = false;
                // console.log("O pulo não pode ser feito");
            }
            else {
                this.canJump = true;
                // console.log("O pulo pode ser feito");
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

            this.CheckLoseLife();
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