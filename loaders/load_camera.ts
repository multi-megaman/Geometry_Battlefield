import { PerspectiveCamera } from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {WebGLRenderer} from "three/src/renderers/WebGLRenderer";

export class CameraController {
    camera: PerspectiveCamera;
    cameraControls: OrbitControls;

    constructor(fov: number, aspect: number, near: number, far: number, renderer: WebGLRenderer){
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.cameraControls = new OrbitControls(this.camera, renderer.domElement);

        //Configurações inicais da câmera
        this.camera.position.setZ(600)
        //Configurações do controlador de câmera
        this.cameraControls.enableRotate = true; // Habilitar rotação
        // this.cameraControls.autoRotate = true; // Habilitar rotação automática
        this.cameraControls.enableDamping = true; //habilita o damping, que é a inércia do movimento do mouse
        this.cameraControls.enablePan = false; //desabilita o pan
        this.cameraControls.dampingFactor = 0.05; //quanto maior o dampingfactor, mais lento o damping
        this.cameraControls.enableZoom = false; //desabilita o zoom
        this.cameraControls.maxDistance = 110; //distância máxima que a câmera pode se afastar
        this.cameraControls.minDistance = 110; //distância mínima que a câmera pode se aproximar
    }


}