<template>
    <div class="viewer" oncontextmenu="event.preventDefault()" v-show="general.viewerShow">
        <div class="header">
            <div class="buttons">
                <btn class="btn-shrink" icon="square-medium-outline" @click="shrink"/>
                <btn class="btn-expand" icon="square-outline" @click="expand"/>
            </div>

            <div ref="title" class="title">{{ modalTitle }}</div>

            <div class="buttons">
                <btn class="btn-menu" icon="menu"/>
                <btn class="btn-close" icon="close" @click="general.viewerShow = false"/>
            </div>
        </div>

        <div class="viewport">
            <div ref="content" class="content">
                <router-link to="/">Home</router-link>
                | <router-link to="/about">About</router-link>
                | <router-link to="/profile">Profile</router-link>
                | <router-link to="/registration">Registration</router-link>
                | <router-link to="/dummy">Dummy</router-link>

                <router-view/>
            </div>
        </div>

        <div class="footer">
            <div class="status">X: {{ general.viewerLeft }}</div>
            <div class="status">Y: {{ general.viewerTop }}</div>
            <div class="status">{{ general.contentWidth }} &times; {{ general.contentHeight }}</div>
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
            modalTitle: "Content Viewer"
        } ),

        computed: {
            ...mapStores( useGeneral ),

            left () {
                return `${ this.general.viewerLeft }px`;
            },

            top () {
                return `${ this.general.viewerTop }px`;
            },

            width () {
                return `${ this.general.contentWidth }px`;
            },

            height () {
                return `${ this.general.contentHeight }px`;
            },

            zIndex () {
                return this.general.viewerZ;
            }
        },

        //inject: [ 'scene', 'renderer', 'controls', 'world' ],

        mounted () {
            /*this.world.generate();
            this.scene.add( this.world );

            this.pt = performance.now(); // previous time

            this.$refs.canvas.replaceWith( this.renderer.domElement );
            this.renderer.resize( this.general.contentWidth, this.general.contentHeight );*/

            //if ( this.general.viewerLeft === null ) this.general.centerViewer();

            this.$refs.title.addEventListener( 'mousedown', this.handleMouseDown );

            this.$el.addEventListener( 'mousedown', this.handleActivate );
        },

        methods: {
            shrink () {
                this.general.contentWidth  = 800;
                this.general.contentHeight -= 72;
                //this.renderer.resize( this.general.contentWidth, this.general.contentHeight );
            },

            expand () {
                this.general.contentWidth  = 800;
                this.general.contentHeight += 72;
                //this.renderer.resize( this.general.contentWidth, this.general.contentHeight );
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

                this.general.viewerLeft = left;
                this.general.viewerTop  = top;
            },

            handleActivate ( ev ) {
                if ( ev.button > 0 ) return;
                this.general.finderZ = 500;
                this.general.viewerZ = 600;
            },
        }
    }
</script>


<style scoped>
    .viewer {
        --modal-color: #999;
        --modal-radius: 10px;
        --horizontal-rule: 1px solid #0004;
        --viewport-color: #ddd;

        position: absolute;
        left: v-bind(left);
        top: v-bind(top);
        z-index: v-bind(zIndex);
        border-radius: var(--modal-radius);
        background-color: var(--modal-color);
        box-shadow: 4px 4px 8px 0 #0004;

        display: flex;
        flex-direction: column;
    }
    .viewer:not(.grabbing) {
        transition: left 0.5s ease, top 0.5s ease;
    }

    .header {
        display: flex;
        align-items: center;
        column-gap: 12px;
        padding: 6px 12px;
        user-select: none;
        border-bottom: var(--horizontal-rule);
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

    .content {
        background-color: #0001;
        width: v-bind(width);
        height: v-bind(height);
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-color: #0004 #fff4;
        /*scrollbar-color: #fff8 #0004;*/
        color: #222;
        text-align: left;
        padding: 12px 18px;
    }

    .footer {
        display: flex;
        align-items: center;
        column-gap: 4px;
        padding: 6px 12px;
        border-top: var(--horizontal-rule);
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

    .viewer.grabbing {
        box-shadow: 8px 8px 8px 0 #0004;
    }

    .grabbing .title {
        cursor: grabbing;
    }
</style>
