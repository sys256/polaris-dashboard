<template>
    <div class="footbar">
        <!-- <btn icon="square-circle-outline" label="Dummy"/> -->
    </div>
</template>

<script>
    import Btn from '@/components/Btn.vue';

    export default {
        components: {
            Btn
        }
    };
</script>

<style scoped>
    .footbar {
        position: absolute;
        z-index: 900;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 44px;
        color: #ddd;
        background-color: #000a;
        border-top: 1px solid #000d;
        box-shadow: 0 4px 8px 0 #0004;

        display: flex;
        align-items: center;
        column-gap: 12px;
        padding: 6px 12px;
        user-select: none;
    }
</style>
