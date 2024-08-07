<template>
    <div class="toolbar">
        <div class="left">
            <btn icon="square-circle-outline" label="Arrange" @click="general.arrange( renderer )" :disabled="!general.finderShow && !general.viewerShow"/>
            <btn icon="text-box-outline" label="Content Viewer" @click="showViewer" :disabled="general.viewerShow"/>
            <btn icon="cube-outline" label="3D Finder" @click="showFinder" :disabled="general.finderShow"/>
        </div>

        <div class="center">
            Polaris
        </div>

        <div class="right">
            Lab:
            <btn icon="flask-empty-outline" label="Add Card" @click="addRandomCard"/>
            <btn icon="flask-empty-outline" label="Add to Center" @click="addCenterCard"/>
            W: {{ stack.width }} H: {{  stack.height }}
            <btn icon="flask-empty-outline" label="Arrange" @click="stack.arrangeAll"/>
        </div>

    </div>
</template>

<script>
    import { mapStores, useGeneral, useStack } from '@/plugins/pinia.js';
    import Btn                                 from '@/components/Btn.vue';

    export default {
        components: {
            Btn
        },

        computed: {
            ...mapStores( useGeneral, useStack )
        },

        inject: [ 'renderer' ],

        methods: {
            /**
             * Teszt funkció. Új card elhelyezése a stack tetején random paraméterekkel.
             */
            addRandomCard () {
                this.stack.addCard( {
                    x: 100 + Math.floor( Math.random() * 800 ),
                    y: 100 + Math.floor( Math.random() * 400 ),
                    w: 100 + Math.floor( Math.random() * 800 ),
                    h: 100 + Math.floor( Math.random() * 400 ),
                    title: `Title ${ Math.floor( Math.random() * 1000 ) }`
                } );
            },

            addCenterCard () {
                this.stack.addCard( {
                    w: 100 + Math.floor( Math.random() * 800 ),
                    h: 100 + Math.floor( Math.random() * 400 ),
                    title: `Title ${ Math.floor( Math.random() * 1000 ) }`
                } );
            },

            arrange () {
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
            },

            showFinder () {
                this.general.finderShow = true;
                this.general.finderZ = 600;
                this.general.viewerZ = 500;
            },

            showViewer () {
                this.general.viewerShow = true;
                this.general.finderZ = 500;
                this.general.viewerZ = 600;
            }
        }
    };
</script>

<style scoped>
    .toolbar {
        position: absolute;
        z-index: 900;
        left: 0;
        top: 0;
        right: 0;
        height: 45px;
        color: #ddd;
        background-color: #0008;
        border-bottom: 1px solid #000c;
        box-shadow: 0 4px 8px 0 #0004;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 6px 12px;
        user-select: none;
    }

    .left,
    .center,
    .right {
        display: flex;
        gap: 6px;
        align-items: center;
    }

    .left,
    .right {
        flex: 1 1 100%;
    }

    .left {
        justify-content: flex-start;
    }

    .right {
        justify-content: flex-end;
    }
</style>
