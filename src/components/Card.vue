<template>
    <div class="card" oncontextmenu="event.preventDefault()" v-show="opts.state !== 'minimized'" :class="{ topmost: topmost, maximized: maximized }">
        <div class="header">
            <div class="buttons">
                <btn icon="square-medium-outline" @click="handleMinimizeClick"/>
                <btn :icon="opts.state === 'maximized' ? 'fullscreen-exit' : 'fullscreen'" @click="handleMaximizeClick"/>
                <btn :icon="opts.pinned ? 'pin-off-outline' : 'pin-outline'" @click="this.stack.togglePinned"/>
            </div>

            <div ref="title" class="title">
                <icon class="card-icon" :name="opts.icon"/>
                <div>{{ opts.title }}</div>
            </div>

            <div class="buttons">
                <btn icon="menu"/>
                <btn icon="close" @click="close"/>
            </div>
        </div>

        <div class="viewport">
            <div ref="content" class="content">
                <p>idx: {{ idx }}</p>
                <p>state: {{ opts.state }}</p>
                <p>color: {{ opts.color }}</p>
                <p>key: {{ opts.key }}</p>
                <p>{{ topmost }}</p>
            </div>
        </div>

        <div class="footer">
            <div class="status">X: {{ opts.x }}</div>
            <div class="status">Y: {{ opts.y }}</div>
            <div class="status">{{ opts.w }} &times; {{ opts.h }}</div>

            <div class="corner" ref="corner" v-show="opts.state !== 'maximized'">
                <icon class="corner-icon" name="resize-bottom-right"/>
            </div>
        </div>

        <transition>
            <div ref="overlay" class="overlay" v-show="!topmost" :class="{ blocking: !topmost }"/>
        </transition>
    </div>
</template>


<script>
    import { mapStores, useStack } from '@/plugins/pinia.js';
    import Btn                     from '@/components/Btn.vue';
    import Icon                    from '@/components/Icon.vue';

    export default {
        components: {
            Btn,
            Icon
        },

        props: {
            opts: { type: Object, default: {} },
            idx:  { type: Number, default: 0 }
        },

        computed: {
            ...mapStores( useStack ),

            left      () { return this.opts.state === 'maximized' ? '0px' : `${ this.opts.x }px`; }, // Card x position
            top       () { return this.opts.state === 'maximized' ? '45px' : `${ this.opts.y }px`; }, // Card y position

            width     () { return this.opts.state === 'maximized' ? `${ this.stack.width }px` : `${ this.opts.w }px`; },                        // Content width
            height    () { return this.opts.state === 'maximized' ? `${ this.stack.height - 45 * 2 - 45 * 2 }px` : `${ this.opts.h - 45 * 2 }px`; }, // Content height

            z         () { return 100 + this.idx; },                           // Card z-index
            color     () { return this.opts.color; },                          // Header and footer color
            topmost   () { return this.idx === this.stack.items.length - 1; }, // Ez a legfelső card a stackben?

            maximized () { return this.opts.state === 'maximized' }
        },

        mounted () {
            this.$refs.overlay.addEventListener( 'click', this.handleOverlayClick );       // Card bring to front
            this.$refs.title.addEventListener( 'mousedown', this.handleTitleMouseDown );   // Card move
            this.$refs.corner.addEventListener( 'mousedown', this.handleCornerMouseDown ); // Card resize
        },

        methods: {
            handleOverlayClick ( ev ) {
                if ( ev.button > 0 ) return; // Nem LMB

                this.stack.bringToFront( this.idx );
            },

            handleTitleMouseDown ( ev ) {
                if ( ev.button > 0 ) return;                   // Nem LMB
                if ( this.opts.state === 'maximized' ) return; // Maximized card nem mozgatható

                document.documentElement.addEventListener( 'mouseup', this.handleTitleMouseUp );
                document.documentElement.addEventListener( 'mousemove', this.handleTitleMouseMove );

                this.$el.classList.add( 'grabbing' );
            },

            handleTitleMouseUp ( ev ) {
                document.documentElement.removeEventListener( 'mouseup', this.handleTitleMouseUp );
                document.documentElement.removeEventListener( 'mousemove', this.handleTitleMouseMove );

                this.$el.classList.remove( 'grabbing' );
            },

            handleTitleMouseMove ( ev ) {
                const rect = this.$el.getBoundingClientRect(); // DOMRect

                const x = rect.x + ev.movementX;
                const y = rect.y + ev.movementY;

                this.stack.setPosition( x, y );
            },

            handleCornerMouseDown ( ev ) {
                if ( ev.button > 0 ) return; // Nem LMB

                document.documentElement.addEventListener( 'mouseup', this.handleCornerMouseUp );
                document.documentElement.addEventListener( 'mousemove', this.handleCornerMouseMove );
            },

            handleCornerMouseUp ( ev ) {
                document.documentElement.removeEventListener( 'mouseup', this.handleCornerMouseUp );
                document.documentElement.removeEventListener( 'mousemove', this.handleCornerMouseMove );
            },

            handleCornerMouseMove ( ev ) {
                const rect = this.$el.getBoundingClientRect(); // DOMRect

                const w = rect.width  + ev.movementX;
                const h = rect.height + ev.movementY;

                this.stack.setSize( w, h );
            },

            handleMinimizeClick ( ev ) {
                this.stack.setState( 'minimized' );
            },

            handleMaximizeClick ( ev ) {
                switch ( this.opts.state  ) {
                    case 'normal': this.stack.setState( 'maximized' ); break;
                    case 'maximized': this.stack.setState( 'normal' ); break;
                }
            },

            close ( ev ) {
                this.stack.removeCard();
            }
        }
    }
</script>


<style scoped>
    .card {
        --card-radius: 10px;
        --card-shadow: 4px 4px 10px 2px #0004;
        --card-grabbing-shadow: 8px 8px 10px 4px #0004;
        --card-divider: 1px solid #0004;
        --card-text-color: #eee;
        --card-color: #bbb;

        position: absolute;
        overflow: hidden;
        left: v-bind(left);
        top: v-bind(top);
        z-index: v-bind(z);
        color: var(--card-text-color);
        border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
        user-select: none;
    }
    .card.maximized {
        border-radius: 0;
    }

    .overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #0002;
        transition: opacity 0.35s;
        pointer-events: none;
    }
    .v-enter-from {
        opacity: 0;
    }
    .v-enter-to {
        opacity: 1;
    }
    .v-leave-from {
        opacity: 1;
    }
    .v-leave-to {
        opacity: 0;
    }
    .overlay.blocking {
        pointer-events: auto;
    }

    .header {
        display: flex;
        align-items: center;
        column-gap: 12px;
        padding: 6px 12px;
        user-select: none;
        border-bottom: var(--card-divider);
        background-color: var(--card-color);
    }
    .card.topmost .header {
        background-color: v-bind(color);
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
        padding: 4px 12px;
        width: 0;
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        flex: 1;
        font-weight: 700;
        font-size: 19px;
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 6px;
    }
    .card.maximized .title {
        cursor: default;
    }

    .card-icon {
        width: 24px;
        height: 24px;
        flex: 0 0 24px;
    }

    .viewport {
        background-color: var(--card-color);
        min-width: 240px;
        min-height: 150px;
        width: v-bind(width);
        height: v-bind(height);
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
        border-top: var(--card-divider);
        background-color: var(--card-color);
    }
    .card.topmost .footer {
        background-color: v-bind(color);
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

    .corner {
        position: relative;
        left: 0;
        top: 0;
        width: 16px;
        height: 32px;
    }
    .corner-icon {
        position: absolute;
        right: -12px;
        bottom: -6px;
        width: 28px;
        height: 28px;
        padding: 0 4px 4px 0;
        cursor: nwse-resize;
    }

    .card.grabbing {
        box-shadow: var(--card-grabbing-shadow);
    }

    .card.grabbing .title {
        cursor: grabbing;
    }
</style>
