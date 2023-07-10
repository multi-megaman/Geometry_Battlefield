import * as THREE from 'three';
import { spaceBackground } from './loadTextureCube';

//Normal Ballus texture
var normalFaceMap = new THREE.TextureLoader().load('../textures/ballus/normal/Ballus_normal.png');
normalFaceMap.flipY = false;
export var normalTexture = new THREE.MeshStandardMaterial({map: normalFaceMap,metalness: 0,roughness: 1});

//Angry Ballus texture
var angryFaceMap = new THREE.TextureLoader().load('../textures/ballus/angry/Ballus_angry.png');
angryFaceMap.flipY = false;
export var angryTexture = new THREE.MeshStandardMaterial({map: angryFaceMap,metalness: 0,roughness: 1});

//Super Ballus texture
var superFaceMap = new THREE.TextureLoader().load('../textures/ballus/super/Ballus_super.png');
let superRoughnessMap = new THREE.TextureLoader().load('../textures/ballus/super/Ballus_super_roughness.jpg');
let superNormalMap = new THREE.TextureLoader().load('../textures/ballus/super/Ballus_super_normal.jpg');
let superDisplacementMap = new THREE.TextureLoader().load('../textures/ballus/super/Ballus_super_displacement.jpg');
let superMetalMap = new THREE.TextureLoader().load('../textures/ballus/super/Ballus_super_metal.jpg');
let superReflectionMap = new THREE.TextureLoader().load('../textures/ballus/super/Ballus_super_reflection.jpg');
superFaceMap.flipY = false;
export var superTexture = new THREE.MeshStandardMaterial({map: superFaceMap,
                                                          roughness: 0,
                                                          metalness: 1,   
                                                          metalnessMap: superMetalMap,
                                                          roughnessMap: superRoughnessMap, 
                                                          normalMap: superNormalMap,
                                                          envMap: spaceBackground,
                                                          envMapIntensity: 50,
                                                          exposure: 0});

// var superFaceMap = new THREE.TextureLoader().load('../textures/ballus/super/Ballus_super.png');
// superFaceMap.flipY = false;
// export var superTexture = new THREE.MeshStandardMaterial({map:superFaceMap, metalness: 1, roughness: 0.1, exposure: 0, envMap: spaceBackground});