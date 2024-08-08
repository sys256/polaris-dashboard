/*********************
 **  Terrain Class  **
 *********************/

// Low-poly domborzat

import { Group, PlaneGeometry, TextureLoader, RepeatWrapping,
         MeshToonMaterial, Mesh, FrontSide, NearestFilter, Vector2 } from 'three';

import map from '@/world/textures/map.png';
import img from '@/world/textures/terrain.png';

export default class extends Group {

    constructor () {
        super();

        const geometry = new PlaneGeometry( 512, 512, 128, 128 );
        const heightmap = new TextureLoader().load( map );

        const tex = new TextureLoader().load( img );
        //tex.wrapS = RepeatWrapping;
        //tex.wrapT = RepeatWrapping;
        //tex.repeat = new Vector2( 4, 4 );
        tex.magFilter = NearestFilter;
        tex.minFilter = NearestFilter;

        const material = new MeshToonMaterial( {
            //color: 0x777777,
            //wireframe: true,
            map: tex,
            displacementMap: heightmap,
            displacementScale: 50,
            precision: 'lowp',
            dithering: true,
            side: FrontSide,
            transparent: true
        } );

        const mesh = new Mesh( geometry, material );
        //mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = -16;
        this.add( mesh );
    }
}
