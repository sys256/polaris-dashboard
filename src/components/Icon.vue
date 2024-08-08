<template>
    <div :style="cssProps" :class="`icon mdi mdi-${ name }`"/>
</template>


<script>
    export default {
        props: {
            name:  { type: String, default: '' },
            scale: { type: Number, default: 1  }
        },

        computed: {
            cssProps () {
                return {
                    '--size': `${ 24 * this.scale }px`
                }
            }
        }
    }
</script>


<style scoped>
    .icon {
        width: var(--size);
        height: var(--size);
        overflow: hidden;
    }

    .icon:before {
        display: block;
        width: var(--size);
        height: var(--size);
        overflow: hidden;

        font: normal normal normal 24px/1 "MDI";
        font-size: var(--size);
        line-height: 1;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
