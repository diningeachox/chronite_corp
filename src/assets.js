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

export var bg = document.getElementById('bg');
export var bg_ctx = bg.getContext("2d");

//export var projector = new THREE.Projector();

gl.width = window.innerWidth;
gl.height = window.innerHeight;
gl.style.left = "0px";

dialogFont = new FontFace('dialogFont', 'url(./fonts/Jost-500-Medium.otf)');
dialogFont.load().then(
    function(font){
    // with canvas, if this is ommited won't work
    document.fonts.add(font);
    console.log('Dialog Font loaded');
}).catch(console.error);

// Video object for cutscene and intros (if needed)
/*
export const media = document.querySelector('video');
media.removeAttribute('controls'); //Remove default controls
media.style.visibility = 'hidden';
*/

//Cursor
export var cursor = new Cursor(ol, 0, 0);




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
    fragmentShader: shaders.nebula
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
    //vertexShader: shaders.vert,
    //fragmentShader: shaders.nebula,
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
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
}
controls.enableRotate = false;

scene.background = null;


//Background nebula
const background = new THREE.TextureLoader().load( "../sprites/nebula.jpg");
background.magFilter = THREE.NearestFilter;
background_material.uniforms.textureSampler.value = background;

export var plane_mesh = new THREE.Mesh( plane_geometry, plane_material );
plane_mesh.position.set( 0, 0, -100);
plane_mesh.layers.disableAll();
plane_mesh.layers.set(0); // Layer 0 for background
//scene.add( plane_mesh );

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

//HQ planet indicator
const ring_geometry = new THREE.RingGeometry( 90, 95, 24 );
const ring_material = new THREE.MeshBasicMaterial( { color: 0xff4a00, side: THREE.DoubleSide } );
const ring = new THREE.Mesh( ring_geometry, ring_material );
scene.add( ring );
ring.scale.set(0.1, 0.1, 0.1);
ring.position.set(0, 0, -80);
ring.layers.disableAll();
ring.layers.set(2); //Layer 1 for planets

//Selection geometry
const select_geometry = new THREE.SphereGeometry( 80, 16, 16 );

const bar_geometry = new THREE.PlaneBufferGeometry( 120, 15 );
const black_material = new THREE.MeshBasicMaterial({
    color: 0x2a3a2a
});
export function StarFactory(x, y){
    const planet_geometry = new THREE.SphereGeometry( 64, 24, 24 );
    //Color
    const uniforms = {
      color: { value: new THREE.Color( 0x00a822 ) },
      wetness: {value: Math.random() * 0.8 + 0.2},
      seed: {value: Math.random() + 1.0},
    };
    uniforms.color.value.setHex( Math.random() * 0xffff87 );
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

    //HP bar

    const hp_material = new THREE.MeshBasicMaterial({
        color: 0x00ab00,
        transparent: true,
        opacity: 1.0
    });
    const hp_bar = new THREE.Mesh(bar_geometry, hp_material);
    var height = 64 * scale;
    hp_bar.scale.set(0.1, 0.1, 0.1);
    hp_bar.position.set(x, y + height * 1.2, -80 + height + 1);
    hp_bar.layers.disableAll();
    hp_bar.layers.set(0); //Layer 1 for planets

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
    scene.add(hp_bar);

    matching_sphere[sphere.uuid] = {sel: sel_sphere, stat: hp_bar}; //Match the selection sphere with actual sphere
    materials[sphere.uuid] = {1: shaderMaterial, 0: black_material};
    //scene.add(sphere);
    return sphere.uuid;
}


export function LaneFactory(source, destination){
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
      linewidth: 8, // in pixels
      vertexColors: true,
      //resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,
      opacity: 0.5

    } );
    matLine.resolution.set( gl.width, gl.height); //Set screen resolution (very important!)
    const line = new Line2( lane_geometry, matLine );
    line.computeLineDistances();
    line.scale.set( 1, 1, 1 );
    line.layers.disableAll();
    line.layers.set(1); //Layer 1
    scene.add(line);

    console.log("Lane created!");
    return line.uuid;
}

// Create a sprite object in THREE.js
export function SpriteFactory(x, y, src){
    const map = loader.load(src);
    const material = new THREE.SpriteMaterial( { map: map } );
    const sprite = new THREE.Sprite( material );
    sprite.position.set(x, y, 0);
    sprite.scale.set(2, 2, 2);
    sprite.layers.disableAll();
    sprite.layers.set(2); //Layer 2 so it's non-interactable
    scene.add(sprite);
    //sprites[id] = sprite;
    return sprite.uuid;
}

export const ShipFactory = (x, y, type) => {
    switch (type) {
      case 0:
        return SpriteFactory(x, y, "../sprites/basic.png");
        break;
      case 1:
        return SpriteFactory(x, y, "../sprites/tanker.png");
        break;
      case 2:
        return SpriteFactory(x, y, "../sprites/cutter.png");
        break;
    }
    return null;
}

//Field outline (before placing)
const geometry = new THREE.CircleGeometry( 7, 32 );
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.0,
    wireframe: true
});
export const circle = new THREE.Mesh( geometry, material );

circle.position.set(0, 0, -50);
circle.layers.disableAll();
circle.layers.set(2); //Layer 2 so it's non-interactable
scene.add( circle );

// Create an area effect field
export function FieldFactory(x, y, size, type){
    const geometry = new THREE.CircleGeometry( size, 32 );
    var color = 0x00ff00;
    if (type == "speed"){
        color = 0xffab00;
    }
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25
    });
    const circle = new THREE.Mesh( geometry, material );

    circle.position.set(x, y, -50);
    circle.scale.set(1, 1, 1);
    circle.layers.disableAll();
    circle.layers.set(2); //Layer 2 so it's non-interactable
    scene.add( circle );
    fields[circle.uuid] = circle;

    return circle.uuid;
}
