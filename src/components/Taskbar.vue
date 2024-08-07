<template>
    <div class="taskbar" oncontextmenu="event.preventDefault()">

        <div class="minis">
            <mini v-for="( opts, idx ) of stack.items" :opts="opts" :idx="idx" :key="opts.key"/>
        </div>

    </div>
</template>


<script>
    import { mapStores, useStack } from '@/plugins/pinia.js';
    import Mini                    from '@/components/mini.vue';

    export default {
        components: {
            Mini
        },

        computed: {
            ...mapStores( useStack )
        }
    }
</script>


<style scoped>
    .taskbar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 45px;
        color: #ddd;
        background-color: #0008;
        border-top: 1px solid #000c;
        box-shadow: 0 -4px 8px 0 #0004;
        display: flex;
        column-gap: 12px;
        justify-content: space-between;
        align-items: center;
        z-index: 800;
        pointer-events: none;
        user-select: none;
    }

    .minis {
        padding: 6px 12px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 6px;
        pointer-events: auto;
    }
</style>
