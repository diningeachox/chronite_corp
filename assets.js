import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135.0/build/three.module.js';

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

//DOM Elements
export var canvas = document.getElementById('canvas');
export var overlay = document.getElementById('overlay');
export var gl = document.getElementById('gl');
export var c = canvas.getContext("2d");
export var ol = overlay.getContext("2d");

// Video object for cutscene and intros (if needed)
/*
export const media = document.querySelector('video');
media.removeAttribute('controls'); //Remove default controls
media.style.visibility = 'hidden';
*/

//Cursor
export var cursor = new Cursor(ol, 0, 0);

//fonts
var dialogFont = new FontFace('dialogFont', 'url(./fonts/Jost-500-Medium.otf)');
dialogFont.load().then(function(font){
  // with canvas, if this is ommited won't work
  document.fonts.add(font);
  console.log('Dialog Font loaded');
});


/** WebGL renderer **/
export const renderer = new THREE.WebGLRenderer({powerPreference: "high-performance",
        alpha: true,
        antialias: true,
        autoClear: true,
        canvas: gl
      });
renderer.setClearColor(0xDDDDDD, 0);

//Texture loading
const loader = new THREE.TextureLoader();

export const ortho_camera = new THREE.OrthographicCamera(gl.width / - 2,
            gl.width / 2, gl.height / 2, gl.height / - 2, 1, 1000);

export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

export const camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT);
//camera.position.z = 50;
//scene.add(camera);
ortho_camera.position.z = 1;
scene.add(ortho_camera);

var plane_geometry = new THREE.PlaneBufferGeometry( 2, 2 );

export const uniforms = {
    u_time: { type: "f", value: 0.0 },
    u_resolution: { type: "v2v", value: new THREE.Vector2() },
    u_mouse: { type: "v2v", value: new THREE.Vector2() },
    tex: { value: null },
    u_color: {type: "v3v", value: new THREE.Vector3() }
};

// Special effects that go over the whole screen
export const plane_material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: shaders.vert,
    fragmentShader: shaders.frag
} );

export var mesh = new THREE.Mesh( plane_geometry, plane_material );
//scene.add( mesh );

//Orbit controls
export const controls = new OrbitControls(camera, renderer.domElement );


scene.background = null;

//Read any jsons we may use to store game data
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(file, rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// Create a sprite object in THREE.js
export function SpriteFactory(src, id){
    const map = new THREE.TextureLoader().load(src);
    const material = new THREE.SpriteMaterial( { map: map } );
    const sprite = new THREE.Sprite( material );
    sprite.scale.set(20, 20, 1); //Don't scale the z-component because we are 2D
    scene.add( sprite );
    sprites[id] = sprite;
}
