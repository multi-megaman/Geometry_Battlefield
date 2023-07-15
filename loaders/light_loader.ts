import { PointLight, PointLightHelper, AmbientLight, SpotLight, SpotLightHelper, Vector3 } from "three";


export function generate_PointLight(scene:THREE.Scene,color:number,position:Vector3,intensity:number,helper:Boolean){
    let light = new PointLight(color,intensity);
    light.castShadow = true;
    // light.shadow.radius = 8;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.position.set(position.x,position.y,position.z);
    scene.add(light);
    if(helper){
        let lightHelper = new PointLightHelper(light,1);
        scene.add(lightHelper);
    }
    return light;
}

export function generate_AmbientLight(scene:THREE.Scene,color:number,position:Vector3,intensity:number){
    let light = new AmbientLight(color,intensity);
    // light.castShadow = true;
    // light.shadow.radius = 8;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;
    light.position.set(position.x,position.y,position.z);
    scene.add(light);
    return light;
}

export function generate_SpotLight(scene:THREE.Scene,color:number,position,Vector3,intensity:number,helper:Boolean){
    let light = new SpotLight(color,intensity);
    light.castShadow = true;
    // light.shadow.radius = 8;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.position.set(position.x,position.y,position.z);
    scene.add(light);
    if(helper){
        let lightHelper = new SpotLightHelper(light,1);
        scene.add(lightHelper);
    }
    return light;
}