# Shipping Game (name to be decided)

## Introduction
A shipping management game with time manipulation mechanics. You try to build a galactic shipping empire which aims to maximize profits. However the galaxy is a treacherous place. Use your time manipulation tech to secure your trade routes!

-----------------------------------------------------------------------------------
# Dev Documentation

## Introduction
A small template for building a JS game, it includes:
- ECS (entity-component-system) 
- Scene management
- Audio management (including volume manipulation and frequency analyzers)
- Sprites on the GPU (all sprites are rendered by WebGL via THREE.js)
- 2D Vector math (supports +, -, dot product, modulus, scalar multiplication, elementwise multiplication, projection, normalization)
- Collision detection (aside from the basic circle-circle, rect-rect, there are also exotic ones like point-polygon)
- Custom font management (fairly straightforward)

This project is based on canvas elements in HTML, no SVG elements are used. 

## Usage
Since this project imports THREE.js from a CDN, it must be run from a server. There are apps which let you setup your own server on your local machine. If you're using Chrome, I recommend [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related?hl=en)

Once installed, follow the steps below:
1. Start the server
2. Point to the root directory of this project 
3. Click the link given to run the game (index.html)

## Structure of the code

### index.js:
Houses all the canvases used for the rendering, as well as storing all the relevant audio/sprite/scene variables. Also contains a loading screen.
**Important**: The three files assets.js, game.js, scene.js are imported as modules instead of text/javascript because they either import THREE.js directly or a js file which imports THREE.js. The rest of the files can be imported by text/javascript as normal.

### scene.js:
Contains all the code necessary for scene management. The design philosophy is to make sure that everything the player sees past the loading screen is from a Scene object. For instance the menu will be the "Menu Scene" and the game will be in the "Game Scene". 
Each scene has functions invoked onload and onunload. The also each have their own update, render functions as well as event listeners. So in short they all interact with the user in the same way and render to the canvases in index.js. However the rendering for the game scene differs from the other scene in that its rendering is done in WebGL (the other scenes just to normal 2D rendering on canvas).
There is also a changeScene() function which switches between scenes. This is done by first unloading the old scene, then loading the new one.

### game.js:
This file contains all the game state variables. The frame rate is variable and is adapted to the speed of the user's machine. Contains all of the event listeners (both mouse and keyboard). Also has a pause functionality. The game state is all stored in a Game object, which has its own update and render functions (so essentially the Game Scene object just calls the update and render of the Game object).

### assets.js 
This file contains all the resources needed to set up THREE.js and the accompanying 3D scene needed for rendering the game scene. Since we are building a 2D game, every THREE.js object will lie on the xy-plane with z-coordinate = 0. The camera is an orthographic camera lying above the plane. This gives us an option to zoom in and out pretty easily (since we are doing a space game). 
Another benefit of using WebGL/THREE.js to render 2D objects is that we can do transforms very easily (rotations and scaling), as well as special effects (color change, particles, etc.), which will all use the GPU instead of the CPU. So this was done with performance in mind.

### collision.js
This file contains all the common 2D collision algorithms, which should be enough for our purposes.

### utils.js 
This file is a general catch-all for useful functions and data structures. We'll definitely need a graph data structure for modelling the trade network, so that would go in here.

### sound.js
This file leverages the Web Audio API to create game audio. I created a custom AudioPlayer class that can play and pause a piece of audio, as well as adjust the volume.

### entity.js & component.js 
Barebones implementation of the EC part of ECS. I didn't code this myself (will try to find the source). Basically every agent in the game should be an entity, and each entity will have different components, which are just pieces of data. So if you were to serialize the game agents, they would each just be a dictionary.

### system.js 
The S part of ECS. This file should contain functions which iterate over all entities and manipulates them in some way. So in effect most of the game's updates will be in here. All the obvious functions like moveAgents, drawAgents, checkCollisions will be in here.

### assemblage.js
Creating one entity at a time is cumbersome, an Assemblage is a wrapper for creating a complex entity with multiple components. There's an example Ship entity in here.

### button.js 
Contains code for the buttons seen in the game. They respond to onHover events and onClick events. 

### cursor.js 
A custom cursor appearing over the canvas that we'll need to make our game look better.

The rest of the details should hopefully be in the code's comments. Let me know if you have questions!
