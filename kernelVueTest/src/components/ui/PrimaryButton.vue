<script setup>
    import { computed } from 'vue';
    const props = defineProps({
        text:{type:String, required:true},
        size:{type:String, required:true},
        color:{type:String, required:true}
    });
    const classList = computed(() => {
        if (typeof props.size == "string") {
            return " -"+props.size;
        }

        return "";
    });

    const classColor = computed(() => {
        if (typeof props.color == "string") {
            return " -"+props.color;
        }

        return "";
    })
    const charsDelay = computed(() => props.text.split('').map((char, index) => {
        return {char, delay:Math.sin(index) * 100};
    }));
</script>

<template>
    <button class="effect-glitch-text" :class="classList" type="button">
        <div class="text" :class="classColor">
            <span v-for="item, index in charsDelay" :data-c="item.char" :style="{'--d':charsDelay[index].delay+'ms'}"></span>
        </div>
    </button>
</template>

<style>
    .effect-glitch-text.-xl {
        --font-size: clamp(12px, 5vw, 5vh);
        --c-height: clamp(12px, 5vw, 5vh);
    }

    .effect-glitch-text {
        --c-width: 1px;
        --c-height: clamp(12px, 2vw, 2vh);
        --font-size: clamp(12px, 2vw, 2vh);
        --steps: 7;
        --animation-speed: 500ms;
        font-size: var(--font-size);
        line-height: var(--font-size);
        text-transform: uppercase;
        
        font-family: "Roboto Mono", monospace;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        position: relative;
        color: #fff;

        display: flex;
        flex-direction: column;
        gap: 1vw;
        background: transparent;
        border: none;
    }

    .effect-glitch-text > .text {
        display: flex;
        overflow: hidden;
        height: var(--c-height);
        word-break: break-all;
        white-space: break-spaces;
        text-decoration: none;
        color: inherit;
        justify-content: center;
        cursor: pointer;
    }

    .effect-glitch-text > .text > span {
        display: block;
        transition: transform var(--animation-speed) var(--d) steps(calc(1 + var(--steps)), jump-none);
    
    }

    .effect-glitch-text > .text > span::before {
        display: block;
        content: attr(data-c);
    }

    .text > span::after {
        display: block;
        content: 'kernel' attr(data-c);
        width: var(--c-width);
        height: auto;
        color: #00ffff;
        text-shadow: #00ffff 0 0 6px;
    }

    .text.-red > span::after {
        display: block;
        content: 'kernel' attr(data-c);
        width: var(--c-width);
        height: auto;
        color: #ff4343;
        text-shadow: #ff4343 0 0 6px;
    }

    .text:hover > span {
        transform: translateY(calc(-1 * var(--steps) * var(--c-height)))
    }
</style>