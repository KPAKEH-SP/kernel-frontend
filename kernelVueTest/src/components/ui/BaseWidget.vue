<template>
    <div :class="$style.widget">
        <slot></slot>
    </div>
</template>

<style module>
    .widget {
        border: 1px solid #fff;
        background: radial-gradient(ellipse at right top, rgba(0, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.5) 47%, rgba(0, 0, 0, 0.5) 100%);
        overflow: hidden;
        border-radius: 3vh;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
        box-sizing: border-box;
    }
</style>