<template>
    <div :class="$style.widget">
        <slot></slot>
    </div>
</template>

<style module>
    .widget {
        border: 1px solid #fff;
        box-sizing: border-box;

        width: 100%;
        height: 100%;

        background: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(10px);
        border-radius: 30px;
    }
</style>