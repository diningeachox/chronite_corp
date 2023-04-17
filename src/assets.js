import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135.0/build/three.module.js';
import { Line2 } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/lines/LineGeometry.js';
import {Cursor} from "./cursor.js";
import {Vector2D} from "./vector2D.js";
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
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor(0xDDDDDD, 0);
renderer.clearDepth();
//Texture loading
const loader = new THREE.TextureLoader();

export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

export const raycaster = new THREE.Raycaster(); //For selecting objects
export const pointer = new THREE.Vector2();


raycaster.layers.set( 1 ); //Check only collisions for objects on layer 1

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
ortho_camera.layers.enableAll(); //camera sees all layers by default
scene.add(ortho_camera);

function onPointerMove( event ) {
	  // calculate pointer position in normalized device coordinates
	  // (-1 to +1) for both components
	  pointer.x = ( event.clientX / window.innerWidth) * 2 - 1;
	  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

canvas.addEventListener( 'pointermove', onPointerMove ); //Add event listener


//Background effects
const plane_geometry = new THREE.PlaneBufferGeometry( 100, 100 );

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

export const background_material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            lightIntensity: {type: 'f', value: 1.0},
            textureSampler: {type: 't', value: null}
        }
    ]),
    vertexShader: shaders.tex_vert,
    fragmentShader: shaders.tex_frag,
    transparent: true,
    lights: true
});

/*
const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 1, 0, 0);
scene.add( light );
*/

//Orbit controls
export const controls = new OrbitControls(ortho_camera, canvas );
controls.enableZoom = true;
controls.minZoom = 0.2;
controls.maxZoom = 1.5;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
}
controls.enableRotate = false;

scene.background = null;


//Background nebula
const bg = new THREE.TextureLoader().load( "../sprites/nebula.jpg");
bg.magFilter = THREE.NearestFilter;
background_material.uniforms.textureSampler.value = bg;

export var plane_mesh = new THREE.Mesh( plane_geometry, background_material );
plane_mesh.position.set( 0, 0, -100);
plane_mesh.layers.disableAll();
plane_mesh.layers.set(0); // Layer 0 for background
scene.add( plane_mesh );

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

const planet_geometry = new THREE.SphereGeometry( 64, 32, 32 );
const select_geometry = new THREE.SphereGeometry( 70, 32, 32 );

export function StarFactory(x, y){
    //Color
    const uniforms = {
      color: { value: new THREE.Color( 0x00a822 ) },
      wetness: {value: Math.random() * 0.8 + 0.2}
    };
    uniforms.color.value.setHex( Math.random() * 0xffffff );
    const size = 1 - Math.random() * 0.2;

    //const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:  uniforms,
      	vertexShader: shaders.planet_vert,
      	fragmentShader: shaders.planet_frag
    });
    const sphere = new THREE.Mesh( planet_geometry, shaderMaterial );
    var size_mod = 1 + (Math.random() * 0.8 - 0.4);
    var scale = 0.1 * size_mod;
    sphere.scale.set(scale, scale, scale);
    sphere.position.set(x, y, -80);
    sphere.layers.disableAll();
    sphere.layers.set(1); //Layer 1 for planets

    //Selection sphere
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.0
    });
    const sel_sphere = new THREE.Mesh( select_geometry, material );
    sel_sphere.scale.set(scale, scale, scale);
    sel_sphere.position.set(x, y, -80);
    sel_sphere.layers.disableAll();
    sel_sphere.layers.set(0); //Layer 0 for the selection sphere
    scene.add(sphere);
    scene.add(sel_sphere);
    matching_sphere[sphere.uuid] = sel_sphere; //Match the selection sphere with actual sphere
    //scene.add(sphere);
    return sphere.uuid;
}


export function LaneFactory(source, destination, id){
    //const points = [new THREE.Vector3(source.x, source.y, 0), new THREE.Vector3(destination.x, destination.y, 0)];
    const points = [source.x, source.y, -80, destination.x, destination.y, -80];
    const lane_geometry = new LineGeometry();
    lane_geometry.setPositions( points );
    lane_geometry.setColors([1.0, 170 / 255, 0.0, 1.0, 170 / 255, 0.0]);
    //Set thickness as an attribute
    lane_geometry.setAttribute("linewidth", new THREE.InstancedBufferAttribute(new Float32Array([5.0]), 1));

    //Linematerial with linewidth replaced by an attribute
    const matLine = new LineMaterial( {
      color: 0xffffff,
      linewidth: 5, // in pixels
      vertexColors: true,
      //resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,

    } );
    matLine.resolution.set( gl.width, gl.height); //Set screen resolution (very important!)

    const line = new Line2( lane_geometry, matLine );
    line.computeLineDistances();
    line.scale.set( 1, 1, 1 );
    line.layers.disableAll();
    line.layers.set(2); //Layer 2
    return line;
    //scene.add( line );

    //ECS.entities[id] = line;
}

// Create a sprite object in THREE.js
export function SpriteFactory(src, id){
    const map = loader.load(src);
    const material = new THREE.SpriteMaterial( { map: map } );
    const sprite = new THREE.Sprite( material );
    scene.add(sprite);
    sprites[id] = sprite;
}
