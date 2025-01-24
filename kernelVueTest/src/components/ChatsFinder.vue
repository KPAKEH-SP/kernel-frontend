<template>
    <div :class="$style.wrapper">
        <BaseWidget :class="$style.widget">
            <input :class="$style['finder-input']"
                placeholder="Find chat"/>
            <PhPlus :class="$style['icon-button']" :size="30" @click="createGroupChat = true"/>
        </BaseWidget>
    </div>
</template>

<script setup>
    import { PhPlus } from '@phosphor-icons/vue';
    import BaseWidget from './ui/BaseWidget.vue';

    const createGroupChat = defineModel('createGroupChat', {type: Boolean});

</script>

<style module>
    .wrapper {
        box-sizing: border-box;

        width: 100%;
        height: 70px;
    }

    .widget {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;

        padding-right: 22px;
        padding-left: 22px;
    }

    .finder-input {
        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 20px;
        display: flex;
        align-items: center;

        color: #FFFFFF;

        background-color: transparent;
        border-color: transparent;
        outline: none;

        width: 100%;
        height: max-content;
    }

    .icon-button {
        color: #FFFFFF;

        transition: all ease 0.5s;
    }

    .icon-button:hover {
        color: #00ffff;

        filter: drop-shadow(0 0 10px #00ffff);

        cursor: pointer;
    }
</style>