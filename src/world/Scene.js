/*******************
 **  Scene Class  **
 *******************/

import { Scene, CubeTextureLoader } from 'three';
import right                        from '@/world/textures/skybox/right.png';
import left                         from '@/world/textures/skybox/left.png';
import up                           from '@/world/textures/skybox/up.png';
import down                         from '@/world/textures/skybox/down.png';
import front                        from '@/world/textures/skybox/front.png';
import back                         from '@/world/textures/skybox/back.png';

export default class extends Scene {

    constructor () {
        const loader = new CubeTextureLoader();
        const skybox = loader.load( [
            left, right, // +X,       -X,
            up,   down,  // +Y,       -Y,
            front, back  // +Z (sun), -Z
        ] );

        super();

        this.background = skybox;
    }
}
