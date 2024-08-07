/********************************
 **  Diskville Controls Class  **
 ********************************/

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class extends OrbitControls {

    constructor ( renderer ) {
        //renderer.camera.up.set( 1, 0, 0 );
        //renderer.camera.updateProjectionMatrix();
        //renderer.camera.updateMatrixWorld();

        super( renderer.camera, renderer.domElement );

        this.target.set( 0, 16, 0 );
        this.enablePan = false;
        this.enableZoom = false;
        this.enableDamping = true;
        this.dampingFactor = 0.05; // default 0.05 - Kisebb érték csökkenti a mozgás csillapítását
        this.rotateSpeed = 0.3; // default 1.0
        this.minPolarAngle = Math.PI / 2.5;
        this.maxPolarAngle = Math.PI / 2;

        this.autoRotate = true;
        this.autoRotateSpeed = 0.5; // default 2.0, 30s per orbit at 60fps

        this.update();
    }

}
