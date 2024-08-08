/**********************
 **  Renderer Class  **
 **********************/

import { WebGLRenderer, PCFSoftShadowMap, PerspectiveCamera, DirectionalLight,
         AmbientLight, CameraHelper, Vector2 } from 'three';

export default class extends WebGLRenderer {

    /**
     * Létrehoz egy browser viewport méretű renderert és egy saját kamerát.
     * Beállítja a fényforrásokat és az árnyékok generálását.
     *
     * @param {Scene} scene
     */
    constructor ( scene ) {
        const width  = window.innerWidth;
        const height = window.innerHeight;
        const dpr    = window.devicePixelRatio;

        super( { antialias: true, alpha: false } );

        this.setSize( width, height );
        this.setPixelRatio( dpr );
        this.setClearColor( 0x7799dd );
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;

        this.scene = scene;

        this.camera = new PerspectiveCamera( 60, width / height );
        this.camera.position.set( 0, 16, 128 );

        const sun = new DirectionalLight();
        sun.position.set( 25, 100, 100 );
        sun.castShadow = true;
        sun.shadow.camera.left = -100;
        sun.shadow.camera.right = 100;
        sun.shadow.camera.bottom = -100;
        sun.shadow.camera.top = 100;
        sun.shadow.camera.near = 0.5; // default: 0.5
        sun.shadow.camera.far = 300; // default: 500
        sun.shadow.mapSize = new Vector2( 2048, 2048 ); // default: 512
        sun.shadow.bias= -0.0001;
        this.scene.add( sun );

        //this.scene.add( new CameraHelper( sun.shadow.camera ) );

        const light2 = new DirectionalLight();
        light2.position.set( -10, 20, -5 );
        this.scene.add( light2 );

        const light3 = new DirectionalLight();
        light3.position.set( 10, -5, 10 );
        this.scene.add( light3 );

        const ambient = new AmbientLight();
        ambient.intensity = 0.2;
        this.scene.add( ambient );

        //document.body.appendChild( this.domElement );
    }

    /**
     * Scene frame renderelése a renderer saját kamerájával.
     * A gameloop-ból kell kötelezően meghívni.
     */
    update () {
        this.render( this.scene, this.camera );
    }

    /**
     * A böngészőablak aktuális méretéhez igazítja a kamerát és a renderert.
     * A window resize eseménykezelőből kell meghívni.
     */
    resize ( width, height ) {
        this.setSize( width, height );

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
};
