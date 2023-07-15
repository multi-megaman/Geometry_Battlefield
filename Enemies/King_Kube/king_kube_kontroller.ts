import * as THREE from 'three';
// import { load_king_kube } from './king_kube_loader';

export class King_Kube{

    model: THREE.Group
    head: THREE.Mesh
    right_hand: THREE.Mesh
    left_hand: THREE.Mesh

    //constantes de teste
    right_hand_max_hight: number = 5;
    right_hand_min_hight: number = -5;
    right_hand_up: boolean = true;


    constructor(model: THREE.Group){
        this.model = model;
        this.head = model.children[0] as THREE.Mesh;
        this.right_hand = model.children[1] as THREE.Mesh;
        this.left_hand = model.children[2] as THREE.Mesh;
        // console.log(this.head.isMesh)
    }

    public update(delta: number, target: THREE.Group){
        if (this.right_hand.position.y > this.right_hand_max_hight){
            this.right_hand_up = false;
        }
        if (this.right_hand.position.y < this.right_hand_min_hight){
            this.right_hand_up = true;
        }

        if (this.right_hand_up){
            this.right_hand.position.y += 5*delta;
            this.left_hand.position.y -= 5*delta;
        }
        else{
            this.right_hand.position.y -= 5*delta;
            this.left_hand.position.y += 5*delta;
        }

        //fazer com que a cabeça olhe para o target
        this.head.lookAt(target.position);
        // this.right_hand.lookAt(target.position);
        // this.left_hand.lookAt(target.position);
    }
};