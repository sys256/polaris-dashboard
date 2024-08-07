<template>
    <div class="finder" oncontextmenu="event.preventDefault()" v-show="general.finderShow">
        <div class="header">
            <div class="buttons">
                <btn class="btn-shrink" icon="square-medium-outline" @click="shrink"/>
                <btn class="btn-expand" icon="square-outline" @click="expand"/>
            </div>

            <div ref="title" class="title">{{ modalTitle }}</div>

            <div class="buttons">
                <btn class="btn-menu" icon="menu"/>
                <btn class="btn-close" icon="close" @click="general.finderShow = false"/>
            </div>
        </div>

        <div class="viewport">
            <canvas ref="canvas"/>
        </div>

        <div class="footer">
            <div class="status">X: {{ general.finderLeft }}</div>
            <div class="status">Y: {{ general.finderTop }}</div>
            <div class="status">{{ general.canvasWidth }} &times; {{ general.canvasHeight }}</div>
        </div>
    </div>
</template>


<script>
    import { mapStores, useGeneral } from '@/plugins/pinia.js';
    import Btn                       from '@/components/Btn.vue';

    export default {
        components: {
            Btn
        },

        data: () => ( {
            modalTitle: "3D Finder"
        } ),

        computed: {
            ...mapStores( useGeneral ),

            left () {
                return `${ this.general.finderLeft }px`;
            },

            top () {
                return `${ this.general.finderTop }px`;
            },

            width () {
                return `${ this.general.canvasWidth }px`;
            },

            height () {
                return `${ this.general.canvasHeight }px`;
            },

            zIndex () {
                return this.general.finderZ;
            }
        },

        inject: [ 'scene', 'renderer', 'controls', 'world' ],

        mounted () {
            this.world.generate();
            this.scene.add( this.world );

            this.pt = performance.now(); // previous time

            this.$refs.canvas.replaceWith( this.renderer.domElement );
            this.renderer.resize( this.general.canvasWidth, this.general.canvasHeight );

            if ( this.general.finderLeft === null ) this.general.arrange( this.renderer );

            this.start();

            this.$refs.title.addEventListener( 'mousedown', this.handleMouseDown );


            window.addEventListener( 'visibilitychange', this.handleVisibilityChange );

            this.$el.addEventListener( 'mousedown', this.handleActivate );
        },

        methods: {
            /*arrange () {
                const maxWidth  = window.innerWidth;
                const maxHeight = window.innerHeight - 45 * 4;

                // Ha a finder magasabb a viewportnál, lecsökkentjük a méretét
                while ( this.general.canvasHeight >= maxHeight || this.general.canvasWidth >= maxWidth ) {
                    this.general.canvasWidth -= 100;
                    this.general.canvasHeight = this.general.canvasWidth / 16 * 9;

                    this.renderer.resize( this.general.canvasWidth, this.general.canvasHeight );
                }

                const bcr = document.querySelector( '.finder' ).getBoundingClientRect(); // DOMRect
                this.general.finderLeft = Math.max( 0, ( window.innerWidth  - bcr.width  ) / 2 );
                this.general.finderTop  = Math.max( 0, ( window.innerHeight - bcr.height ) / 2 );
            },*/

            handleVisibilityChange () {
                if ( document.hidden ) {
                    this.stop();

                } else {
                    this.pt = performance.now();
                    this.start();
                }
            },

            shrink () {
                this.general.canvasWidth -= 128;
                this.general.canvasHeight = this.general.canvasWidth / 16 * 9;
                this.renderer.resize( this.general.canvasWidth, this.general.canvasHeight );
            },

            expand () {
                this.general.canvasWidth += 128;
                this.general.canvasHeight = this.general.canvasWidth / 16 * 9;
                this.renderer.resize( this.general.canvasWidth, this.general.canvasHeight );
            },

            handleMouseDown ( ev ) {
                if ( ev.button > 0 ) return;
                document.documentElement.addEventListener( 'mouseup', this.handleMouseUp );
                document.documentElement.addEventListener( 'mousemove', this.handleMouseMove );
                this.$el.classList.add( 'grabbing' );
            },

            handleMouseUp () {
                document.documentElement.removeEventListener( 'mouseup', this.handleMouseUp );
                document.documentElement.removeEventListener( 'mousemove', this.handleMouseMove );
                this.$el.classList.remove( 'grabbing' );
            },

            handleMouseMove ( ev ) {
                const bcr = this.$el.getBoundingClientRect();

                const left = bcr.left + ev.movementX;
                const top  = bcr.top  + ev.movementY;

                this.general.finderLeft = left;
                this.general.finderTop  = top;
            },

            draw () {
                let ct = performance.now(); // current time
                let dt = ( ct - this.pt ) / 1000; // delta time, sec

                this.renderer.update();
                this.controls.update( dt );

                this.pt = ct;
            },

            start () {
                this.renderer.setAnimationLoop( this.draw );
            },

            stop () {
                this.renderer.setAnimationLoop( null );
            },

            handleActivate ( ev ) {
                if ( ev.button > 0 ) return;
                this.general.finderZ = 600;
                this.general.viewerZ = 500;
            },
        }
    }
</script>


<style scoped>
    .finder {
        --header-color: #68a;
        --viewport-color: #ddd;
        --footer-color: #68a;
        --horizontal-rule: 1px solid #0004;
        --modal-radius: 10px;

        /* A rounded corner background "bleed" elkerülésére ne legyen háttérszíne */
        position: absolute;
        left: v-bind(left);
        top: v-bind(top);
        z-index: v-bind(zIndex);
        border-radius: var(--modal-radius);
        box-shadow: 4px 4px 8px 0 #0004;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        /*-webkit-background-clip: padding-box;
        background-clip: padding-box;*/
    }
    .finder:not(.grabbing) {
        transition: left 0.5s ease, top 0.5s ease;
    }

    .header {
        display: flex;
        align-items: center;
        column-gap: 12px;
        padding: 6px 12px;
        user-select: none;
        border-bottom: var(--horizontal-rule);
        background-color: var(--header-color);
    }

    .buttons {
        display: flex;
        align-items: center;
        column-gap: 4px;
    }

    .title {
        border-radius: 8px;
        background-color: #fff2;
        cursor: grab;
        line-height: 16px;
        padding: 8px 12px;
        width: 0;
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        flex: 1;
        font-weight: 700;
        font-size: 19px;
    }

    .viewport {
        background-color: var(--viewport-color);
        min-width: 240px;
        min-height: 150px;

        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .footer {
        display: flex;
        align-items: center;
        column-gap: 4px;
        padding: 6px 12px;
        border-top: var(--horizontal-rule);
        background-color: var(--footer-color);
    }

    .status {
        border-radius: 8px;
        background-color: #fff2;
        line-height: 1;
        padding: 8px 12px;
        width: 0;
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        flex: 1;
    }

    .finder.grabbing {
        box-shadow: 8px 8px 8px 0 #0004;
    }

    .grabbing .title {
        cursor: grabbing;
    }
</style>
