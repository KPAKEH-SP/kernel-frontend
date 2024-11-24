<script setup>
    const isOpened = defineModel('open', { type: Boolean, default: false })
</script>

<template>
    <transition name="blur">
        <div v-if="isOpened" class="modal-blur"></div>
    </transition>
    
    <dialog :open="isOpened" class="modal">
        <button class="close-button" @click="isOpened=false">X</button>
        <slot></slot>
    </dialog>
</template>

<style>
    .modal {
        color: #ffffff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60vw;
        height: 60vh;
        background-color: transparent;
        border: 3px solid #00ffff;
        border-radius: 35px;
        box-shadow: #00ffff 0 0 7px;
        padding: 20px;
        box-sizing: border-box;
        z-index: 1000;
    }

    .modal .close-button {
        position: absolute;
        top: 2%;
        right: 2%;
        width: 4%;
        height: 4%;
        background: transparent;
        color: #ffffff;
        border-color: solid #ffffff;
        border-radius: 0px;
        border: none;
        border-bottom: solid #ffffff;
        outline: none;
        text-align: center;
        transition: 0.3s ease;
    }

    .close-button:hover {
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-radius: 10vh;
        border-color: #00ffff;
        border-top: solid;
        border-left: solid;
        border-right: solid;
        border-bottom: solid;
        color: #00ffff;
    }

    /*
    --- blur
    */

    .modal-blur {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        z-index: 999; 
    }

    .blur-enter-active {
        animation: blur-in .5s ease forwards ;
    }

    .blur-leave-active {
        animation: blur-in .5s ease reverse;
    }

    @keyframes blur-in {
        0% {
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
        }
        100% {
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 100;
        }
    }
</style>