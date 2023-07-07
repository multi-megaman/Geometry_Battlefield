import * as THREE from 'three';

export const spaceBackground = new THREE.CubeTextureLoader().load([
    './models/ballus/super/Super_ballus_envMap/right.png',
    './models/ballus/super/Super_ballus_envMap/left.png',
    './models/ballus/super/Super_ballus_envMap/top.png',
    './models/ballus/super/Super_ballus_envMap/bottom.png',
    './models/ballus/super/Super_ballus_envMap/front.png',
    './models/ballus/super/Super_ballus_envMap/back.png',
  ]); //carrega as 6 faces do cubo