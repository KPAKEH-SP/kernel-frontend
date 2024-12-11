<script setup>
    import { PhCaretUp } from '@phosphor-icons/vue';
    import { computed, useCssModule, useSlots } from 'vue'

    const classes = useCssModule();
    const slots = useSlots();

    const model = defineModel('activeSlot', {default:'top'});

    const arrowWrapperClassList = computed(() => [classes['arrow-wrapper'], classes[model.value]]);

    const avaliableSlots = computed(() => ['top', 'right', 'bottom', 'left'].filter(item => slots[`icon-${item}`]));

    const handleSwitchState = (name) => {
        model.value = name;
    }
</script>

<template>
    <div :class="$style.root">
        <div :class="arrowWrapperClassList">
            <PhCaretUp :class="$style.arrow" :size="40"/>
        </div>

        <div :class="$style.wrapper">
            <div :class="$style.content">
                <slot :name="`content-${model}`"></slot>
            </div>
            <button v-for="direction in avaliableSlots"
                type="button" :class="{
                [$style.button]: true, 
                [$style['active-button']]: model === direction}" 
                @click="handleSwitchState(direction)"
                :style="{gridArea: direction}">

                <slot :name="`icon-${direction}`"></slot>
            </button>
        </div>
    </div>
</template>

<style module>
    .root {
        position: relative;
        --icon-size: 40px;
    }

    .arrow-wrapper {
        position: absolute;
        display: flex;
        justify-content: center;
        height: 100%;
        width: 100%;
        transform: rotate(var(--angle));
        transition: transform 0.5s ease-in-out;
        pointer-events: none;

    }

    .wrapper {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template: 
            "top top top" var(--icon-size)
            "left center right" 1fr
            "bottom bottom bottom" var(--icon-size) / var(--icon-size) 1fr var(--icon-size);
    }

    .button {
        background: transparent;
        border: none;
        outline: none;
        color: inherit;
        appearance: none;
        cursor: pointer;
        transition: all 0.5s ease;
        justify-self: center;
    }

    .button:hover, .active-button {
        color: #00ffff;
        filter: drop-shadow(0 0 10px #00ffff);
    }

    .arrow {
        color: #00ffff;
        filter: drop-shadow(0 0 10px #00ffff);
        margin-top: var(--icon-size);
    }

    .left {
        --angle: 270deg;
    }

    .bottom {
        --angle: 180deg;
    }

    .right {
        --angle: 90deg;
    }

    .content {
        grid-area: center;
        align-self: center;
    }
</style>