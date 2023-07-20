import * as THREE from 'three';

function createLight() {
  const color = 0x303030;
  const intensity = 10;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-100, 100, 2);
  return light;
}

function moveLight(light){
    light.position.x += 1;
    if(light.position.x > 100){
        light.position.x = -100;
    }
}


export {createLight,moveLight};