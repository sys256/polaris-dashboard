<template>
    <button class="btn" :class="{ 'icon-btn': !label.length }" :disabled="disabled">
        <icon v-if="icon.length" :name="icon"/>
        <span v-if="label.length" v-text="label"/>
    </button>
</template>


<script>
    import Icon from '@/components/Icon.vue';

    export default {
        components: {
            Icon
        },

        props: {
            icon:     { type: String,  default: '' },
            label:    { type: String,  default: '' },
            disabled: { type: Boolean, default: false }
        }
    }
</script>


<style scoped>
    .btn {
        border-radius: 8px;
        border: 2px solid transparent;
        padding: 2px 8px;
        text-transform: uppercase;
        font-size: 16px;
        line-height: 1.5;
        font-weight: 400;
        font-family: inherit;
        background-color: #ddd;
        transition: border-color 0.25s;

        display: flex;
        column-gap: 6px;
        align-items: center;
    }
    .btn:not([disabled]) {
        cursor: pointer;
    }

    .icon-btn {
        padding: 2px;
    }

    .btn:hover:not([disabled]) {
        border: 2px solid #0004;
        background-color: #eee;
    }

    .btn:active:not([disabled]) {
        border: 2px solid #0008;
        background-color: #eee;
    }
</style>
