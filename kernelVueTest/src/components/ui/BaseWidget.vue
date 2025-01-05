<template>
    <div :class="$style.widget">
        <slot></slot>
    </div>
</template>

<script setup>

</script>

<style module>
    .widget {
        border: 1px solid #fff;
        background-color: rgba(0, 0, 0, 0.8);
        overflow: hidden;
        border-radius: 3vh;
    }
</style>