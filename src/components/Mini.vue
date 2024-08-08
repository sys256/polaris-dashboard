<template>
    <div class="mini" :class="{ active: active, minimized: minimized }" @click="handleClick" v-show="minimized">
        <icon class="mini-icon" :name="opts.icon"/>
        <div>{{ opts.title }}</div>
    </div>
</template>


<script>
    import { mapStores, useStack } from '@/plugins/pinia.js';
    import Icon                    from '@/components/Icon.vue';

    export default {
        components: {
            Icon
        },

        props: {
            opts: { type: Object, default: {} },
            idx:  { type: Number, default: 0 }
        },

        computed: {
            ...mapStores( useStack ),

            color     () { return this.opts.color; },
            active    () { return this.idx === this.stack.activeIdx; },
            minimized () { return this.opts.state === 'minimized' }
        },

        methods: {
            handleClick ( ev ) {
                if ( ev.button > 0 ) return; // Nem LMB

                // A card áthelyezése a stack tetejére
                let idx = 0;
                for ( const card of this.stack.items ) {
                    if ( card.key === this.opts.key ) break;
                    idx++;
                }
                this.stack.bringToFront( idx );

                // A card state visszaállítása a mentett state-re
                this.stack.setState( 'stored' );
            }
        }
    }
</script>


<style scoped>
    .mini {
        --mini-radius: 10px;
        --mini-text-color: #eee;
        --mini-color: #bbb;

        line-height: 16px;
        padding: 4px 12px;
        border-radius: var(--mini-radius);
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 6px;
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        cursor: pointer;
        color: #fff;
        background-color: #ccc;
    }

    .mini-icon {
        width: 24px;
        height: 24px;
        flex: 0 0 24px;
    }

    .mini.active {
        color: #ff0;
    }

    .mini.minimized {
        color: #fff;
        background-color: #8ac;
    }
</style>
