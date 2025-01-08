<template>
    <div :class="$style.avatar">
        <img :src="getAvatar(props.username)" :class="$style['avatar-image']" onerror="this.style.display='none';"/>
        <div v-if="isOpened" :class="$style['spinning-circles']">
            <div :class="$style['spinning-circle']"></div>
            <div :class="$style['spinning-circle']"></div>
            <div :class="$style['spinning-circle']"></div>
            <div :class="$style['spinning-circle']"></div>
        </div>
    </div>
</template>

<script setup>
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    const isOpened = defineModel('open', {type: Boolean, required: false, default: true});
    const props = defineProps({username:{type:String, required:true}});
</script>

<style module>
    .avatar {
        justify-content: center;
        align-items: center;
        position: relative;
        display: flex;
        align-items: center;
        height: 100px;
        width: 100px;
        border: solid #fff 1px;
        border-radius: 50%;
        box-sizing: border-box;
        background: transparent;
    }

    .avatar-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .spinning-circles {
        width: 100%; 
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinning-circle {
        box-sizing: border-box;
        position: absolute;
        width: 120%;
        height: 120%;
        border: 1vmin solid transparent;
        border-radius: 115% 140% 145% 110%/125% 140% 110% 125%;
        mix-blend-mode: screen;
        pointer-events: none;
        box-shadow: #00ffff 0 0 3px, inset #00ffff 0 0 3px;
    }

    .spinning-circle:nth-child(1) {
        border-color: #00ffff;
        transform-origin: 50% 50%;
        animation: spin1 5.5s linear infinite;
    }

    .spinning-circle:nth-child(2) {
        border-color: #00b6b6;
        transform-origin: 50% 50%;
        animation: spin2 5.5s linear infinite;
    }

    .spinning-circle:nth-child(3) {
        border-color: #009c9c;
        transform-origin: 50% 50%;
        animation: spin3 5.5s linear infinite;
    }

    .spinning-circle:nth-child(4) {
        border-color: #006868;
        transform-origin: 50% 50%;
        animation: spin4 5.5s linear infinite;
    }

    @keyframes spin1 {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes spin2 {
        0% {
            transform: rotate(72deg);
        }
        100% {
            transform: rotate(-288deg);
        }
    }

    @keyframes spin3 {
        0% {
            transform: rotate(-144deg);
        }
        100% {
            transform: rotate(216deg);
        }
    }

    @keyframes spin4 {
        0% {
            transform: rotate(216deg);
        }
        100% {
            transform: rotate(-144deg);
        }
    }
</style>