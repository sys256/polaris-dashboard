/*****************************
 **  Diskville World Class  **
 *****************************/

import { Group, CylinderGeometry, BoxGeometry, MeshLambertMaterial, Mesh } from 'three';

export default class extends Group {

    constructor () {
        super();
    }

    /**
     *
     */
    generate () {
        const geometry = new CylinderGeometry( 100, 100, 10, 16 );
        const material = new MeshLambertMaterial( {
            color: 0x009900,
            //transparent: true,
            //opacity: 0.5
        } );
        const mesh = new Mesh( geometry, material );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        //this.add( mesh );

        this.addCenter();

        this.addBuilding( 60, 60 );
        this.addBuilding( 60, -60 );
        this.addBuilding( -60, 60 );
        this.addBuilding( -60, -60 );
    }

    addCenter () {
        const geometry = new BoxGeometry( 8, 64, 8 );
        const material = new MeshLambertMaterial( {
            color: 0xff0000,
            //transparent: true,
            //opacity: 0.5
        } );
        const mesh = new Mesh( geometry, material );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add( mesh );
    }

    addBuilding ( x, y ) {
        const geometry = new BoxGeometry( 8, 8, 8 );
        const material = new MeshLambertMaterial( {
            color: 0x0077ff,
            //transparent: true,
            //opacity: 0.5
        } );
        const mesh = new Mesh( geometry, material );
        mesh.position.set( x, 8, y );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add( mesh );
    }
};
