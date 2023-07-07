import * as THREE from 'three';

export const spaceBackground = new THREE.CubeTextureLoader().load([
    '../textures/skyCubes/Space/right.png',
    '../textures/skyCubes/Space/left.png',
    '../textures/skyCubes/Space/top.png',
    '../textures/skyCubes/Space/bottom.png',
    '../textures/skyCubes/Space/front.png',
    '../textures/skyCubes/Space/back.png',
  ]); //carrega as 6 faces do cubo