import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135.0/build/three.module.js';
import {Cursor} from "./cursor.js";

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

//DOM Elements
export var canvas = document.getElementById('canvas');
export var overlay = document.getElementById('overlay');
export var gl = document.getElementById('gl');
export var c = canvas.getContext("2d");
export var ol = overlay.getContext("2d");

gl.width = window.innerWidth;
gl.height = window.innerHeight;
gl.style.left = "0px";

// Video object for cutscene and intros (if needed)
/*
export const media = document.querySelector('video');
media.removeAttribute('controls'); //Remove default controls
media.style.visibility = 'hidden';
*/

//Cursor
export var cursor = new Cursor(ol, 0, 0);

//fonts
var dialogFont = new FontFace('dialogFont', 'url(../fonts/Jost-500-Medium.otf)');
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

export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

//PerspectiveCamera
//export const camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT);
//camera.position.set(0, 0, 1);
//scene.add(camera);

//OrthographicCamera
export var viewPortWidth = 100;
export var viewPortHeight = gl.height / gl.width * viewPortWidth;
export const ortho_camera = new THREE.OrthographicCamera(viewPortWidth / - 2,
            viewPortWidth / 2, viewPortHeight / 2, viewPortHeight / - 2, 0.1, 2000);
ortho_camera.position.set(0, 0, 1);
scene.add(ortho_camera);

//Background effects
var plane_geometry = new THREE.PlaneBufferGeometry( 100, 100 );

export const plane_uniforms = {
    u_time: { type: "f", value: 0.0 },
    u_resolution: { type: "v2v", value: new THREE.Vector2() },
    u_mouse: { type: "v2v", value: new THREE.Vector2() },
    tex: { value: null },
    u_color: {type: "v3v", value: new THREE.Vector3() }
};

// Special effects that go over the whole screen
export const plane_material = new THREE.ShaderMaterial( {
    uniforms: plane_uniforms,
    vertexShader: shaders.vert,
    fragmentShader: shaders.frag
} );

export var plane_mesh = new THREE.Mesh( plane_geometry, plane_material );
plane_mesh.position.set( 0, 0, -100);
scene.add( plane_mesh );

const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 1, 0, 0);
scene.add( light );


//Orbit controls
//export const controls = new OrbitControls(ortho_camera, renderer.domElement );
//controls.enableZoom = true;

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

export function StarFactory(x, y, id){
    //Color
    var uniforms = {
      color: { value: new THREE.Color( 0xffffff ) }
    };
    uniforms.color.value.setHex( Math.random() * 0xffffff );
    const geometry = new THREE.SphereGeometry( 64, 64, 64 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:  uniforms,
      	vertexShader: shaders.planet_vert,
      	fragmentShader: shaders.planet_frag
    });
    const sphere = new THREE.Mesh( geometry, shaderMaterial );
    sphere.scale.set(0.1, 0.1, 0.1);
    sphere.position.set(x, y, -80);
    scene.add( sphere );


    //Randomize heightmap on surface
    var verts = geometry.getAttribute( 'position' );
    var attributes = {
      displacement: {
        value: new Float32Array( verts.count ) // an empty array
      }
    };

    //Noise function for the vertex values
    var values = attributes.displacement.value;
    for (var v = 0; v < verts.count; v++) {
      values[v] = Math.random() * 2;
    }

    //Set displacement values as an attribute in the vertex shader
    geometry.setAttribute( 'displacement', new THREE.BufferAttribute( attributes.displacement.value, 1 ) );

    ECS.entities[id] = sphere;
}

// Create a sprite object in THREE.js
export function SpriteFactory(src, id){
    const map = loader.load(src);
    const material = new THREE.SpriteMaterial( { map: map } );
    const sprite = new THREE.Sprite( material );
    scene.add(sprite);
    sprites[id] = sprite;
}
