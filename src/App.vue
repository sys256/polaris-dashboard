<template>
    <toolbar/>
    <finder/>
    <viewer/>

    <card v-for="( opts, idx ) of stack.items" :opts="opts" :idx="idx" :key="opts.key"/>
    <taskbar/>
</template>


<script>
    import { mapStores, useGeneral, useStack } from '@/plugins/pinia.js';
    import Toolbar                             from '@/components/Toolbar.vue';
    import Footbar                             from '@/components/Footbar.vue';
    import Finder                              from '@/components/Finder.vue';
    import Viewer                              from '@/components/Viewer.vue';
    import Card                                from '@/components/Card.vue';
    import Taskbar                             from '@/components/Taskbar.vue';

    export default {
        components: {
            Toolbar,
            Footbar,
            Finder,
            Viewer,
            Card,
            Taskbar
        },

        data: () => ( {
            //
        } ),

        computed: {
            ...mapStores( useGeneral, useStack ),
        },

        mounted () {
            const resizeObserver = new ResizeObserver( this.handleBrowserResize );
            resizeObserver.observe( document.documentElement );
        },

        methods: {
            handleBrowserResize ( entries ) {
                for ( const entry of entries ) {
                    if ( entry.target !== document.documentElement ) continue;

                    this.stack.width  = entry?.borderBoxSize[ 0 ].inlineSize ?? entry.contentRect.width;
                    this.stack.height = entry?.borderBoxSize[ 0 ].blockSize  ?? entry.contentRect.height; // Nem használjuk fel
                }
            }
        }
    };
</script>


<style>
    html {
        overflow: hidden;
    }

    #app {
        position: absolute;
        z-index: 2;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
</style>

<style scoped>
    canvas {
        position: absolute;
        z-index: 1;
    }
</style>
