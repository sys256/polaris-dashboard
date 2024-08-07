/*****************************
 **  Diskville Main Module  **
 *****************************/

import { $ } from '@/helpers.js';

import Stats    from 'three/examples/jsm/libs/stats.module.js';
import Scene    from '@/Scene.js';
import Terrain  from '@/Terrain.js';
import Renderer from '@/Renderer.js';
import Controls from '@/Controls.js';
import World    from '@/World.js';
import Tweaks   from '@/Tweaks.js';
import               'ress/ress.css';
import               '../style.css';

const stats = new Stats();
document.body.append( stats.dom );


const scene    = new Scene();
const renderer = new Renderer( scene );
const controls = new Controls( renderer );

const terrain = new Terrain();
scene.add( terrain );

const world = new World();
world.generate();
scene.add( world );

new Tweaks( renderer, controls, world );

let pt = performance.now(); // previous time

/**
 * Gameloop. Minden ~1/60-ad másodpercben meghívásra kerül.
 * */
function draw () {
    let ct = performance.now(); // current time
    let dt = ( ct - pt ) / 1000; // delta time, sec

    renderer.update();
    controls.update( dt );
    stats.update();

    pt = ct;
}

/**
 * Gameloop aktiválása
 */
function start () {
    renderer.setAnimationLoop( draw );
}

/**
 * Gameloop leállítása
 */
function stop () {
    renderer.setAnimationLoop( null );
}

window.addEventListener( 'resize', () => {
    renderer.resize();
} );

window.onload = () => {
    start();
};
