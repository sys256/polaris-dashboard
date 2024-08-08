/******************************
 **  Diskville Tweaks Class  **
 ******************************/

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default class extends GUI {

    constructor ( renderer, controls ) {
        super( {
            title: "",
            width: 320,
            closeFolders: true
        } );

        this.close();

        const cameraFolder = this.addFolder( "CAMERA" );
        //cameraFolder.add( renderer.camera.position, 'y', -100, 100, 1 ).name( "Y" );
        //cameraFolder.add( renderer.camera.position, 'z', -100, 100, 1 ).name( "Z" );
        cameraFolder.add( renderer.camera, 'fov', 30, 120, 1 ).name( "FOV" );
        cameraFolder.add( controls, 'rotateSpeed', 0, 2 ).name( "Rotate Speed" );

        this.onChange( () => {
            //world.generate();
            renderer.camera.updateProjectionMatrix();
        } );
    }
};
