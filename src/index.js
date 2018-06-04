import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  PointLight,
  WebGLRenderTarget,
  BoxGeometry,
  MeshBasicMaterial,
  Group
} from 'three';
import * as THREE from 'three';

import loop from 'raf-loop';
import resize from 'brindille-resize';

import OBJLoader from 'three-obj-loader';
import average from 'analyser-frequency-average';

//import OrbitControls from './js/OrbitControls';
import {
  analyser1,
  freq1,
  bands1,
  analyser2,
  freq2,
  bands2,
  analyser3,
  freq3,
  bands3,
  analyser4,
  freq4,
  bands4,
  analyser5,
  freq5,
  bands5,
  analyser6,
  freq6,
  bands6,
  analyser7,
  freq7,
  bands7
} from './js/audioFreqs';

// shaders

OBJLoader(THREE);

/************************* **********************/

/* preset frequencies */
let bubbles = 0;
let feathers = 0;
let bubbles_high = 0;
let bass = 0;
let kick = 0;
let pad = 0;
let texture = 0;

/* Init renderer and canvas */
const container = document.body;
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x323232);
container.style.overflow = 'hidden';
container.style.margin = 0;
container.appendChild(renderer.domElement);

/* Main scene and camera */
const scene = new Scene();
const w = resize.width;
const h = resize.height;
const camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000);

camera.position.set(0, 0, 150);

const renderTarget = new WebGLRenderTarget(w, h, { format: THREE.RGBAFormat });
console.log(w, h);

/* Lights */
const frontLight = new PointLight(0xffffff, 1);
const backLight = new PointLight(0xffffff, 0.5);
scene.add(frontLight);
scene.add(backLight);
frontLight.position.x = 20;
backLight.position.x = -20;

/* Content of scene */
//model
var loader = new THREE.OBJLoader();
//load a resource
loader.load(
  './src/objects/model.obj',
  // called when resource is loaded
  function(object) {
    const objs = [];

    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        objs.push(child);
      }
    });

    addObj(objs[0]);
  }
);

const group = new Group();
scene.add(group);

function addObj(mesh) {
  var xDistance = w;
  var yDistance = h;
  var zDistance = h;

  var xOffset = -w / 2; //initial offset so does not start in middle
  var yOffset = -h / 2;
  var zOffset = -h / 2;

  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: THREE.FlatShading,
    opacity: 5,
    shininess: 120,
    transparent: true
  });

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        var mesh = new THREE.Mesh(mesh.geometry, material);
        mesh.scale.set(250, 250, 250);
        mesh.position.x = xDistance * (i / 3) + xOffset;
        mesh.position.y = yDistance * (j / 2) + yOffset;
        mesh.position.z = zDistance * (k / 2) + zOffset;
        group.add(mesh);
      }
    }
  }

  var cubeGeometry = new THREE.PlaneGeometry(1, 1);
  cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      resolution: {
        value: new THREE.Vector2(w, h)
      },
      texture: { value: renderTarget.texture },
      frequencies1: { value: new THREE.Vector4() }, // bass
      frequencies2: { value: new THREE.Vector4() }, // bubbles
      frequencies3: { value: new THREE.Vector4() }, // kick
      frequencies4: { value: new THREE.Vector4() }, // pad
      frequencies5: { value: new THREE.Vector4() }, // texture
      frequencies6: { value: new THREE.Vector4() } // bubbles_high
    },

    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });

  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // x, y, z <--- if u put 0 instead of 1 it will explode
  cube.scale.set(w, h, 1);
  scene.add(cube);
  console.log(cube);

  engine.start();
}

var cube;
var cubeMaterial;

// create & launch main loop
const engine = loop(render);

//  Manage Resize canvas
resize.addListener(onResize);
function onResize() {
  camera.aspect = resize.width / resize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(resize.width, resize.height);
}

// Render loop
function render() {
  // get sound freqs
  // get sound
  //1
  bubbles = average(analyser1, freq1, bands1.bubbles.from, bands1.bubbles.to);

  //2
  feathers = average(
    analyser2,
    freq2,
    bands2.feathers.from,
    bands2.feathers.to
  );
  //3
  bubbles_high = average(
    analyser3,
    freq3,
    bands3.bubbles_high.from,
    bands3.bubbles_high.to
  );
  //4
  bass = average(analyser4, freq4, bands4.bass.from, bands4.bass.to);
  //5
  kick = average(analyser5, freq5, bands5.kick.from, bands5.kick.to);
  //6
  pad = average(analyser6, freq6, bands6.pad.from, bands6.pad.to);
  //7
  texture = average(analyser7, freq7, bands7.texture.from, bands7.texture.to);

  group.traverse(function(o) {
    o.rotation.y += bubbles / 50;
    o.rotation.x += feathers / 5;
    o.rotation.z += bubbles_high / 50;
  });

  // cancel inception
  cube.visible = false;
  group.visible = true;
  renderer.render(scene, camera, renderTarget);

  // rerender
  cube.visible = true;
  group.visible = false;

  cubeMaterial.uniforms.time.value += 0.1; // maj of cpu var on gpu var
  cubeMaterial.uniforms.frequencies1.value.set(bass);
  cubeMaterial.uniforms.frequencies2.value.set(bubbles);
  cubeMaterial.uniforms.frequencies3.value.set(kick);
  cubeMaterial.uniforms.frequencies4.value.set(pad);
  cubeMaterial.uniforms.frequencies5.value.set(texture);
  cubeMaterial.uniforms.frequencies6.value.set(bubbles_high);

  cubeMaterial.uniforms.frequencies1.needsUpdate = true;
  cubeMaterial.uniforms.frequencies2.needsUpdate = true;
  cubeMaterial.uniforms.frequencies3.needsUpdate = true;
  cubeMaterial.uniforms.frequencies4.needsUpdate = true;
  cubeMaterial.uniforms.frequencies5.needsUpdate = true;
  cubeMaterial.uniforms.frequencies6.needsUpdate = true;

  renderer.render(scene, camera);
}
