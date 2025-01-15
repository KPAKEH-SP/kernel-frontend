<template>
    <dialog
        @cancel="handelCancel"
        @close="handelClose"
        ref="dialog"
        :class="$style.dialog">
        <button :class="$style['close-button']" @click="handelClose">X</button>
        <slot></slot>
    </dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const isOpen = defineModel('open', {type: Boolean})
const dialog = ref<HTMLDialogElement>()
const handelCancel = (event: Event) => {
    isOpen.value = false;
    event.preventDefault()
}

const handelClose = (event: Event) => {
    isOpen.value = false;
    event.preventDefault()
}

watch(isOpen, (isOpenValue) => {
    const dialogEl = dialog.value

    if (!dialogEl) {
        return
    }

    if (isOpenValue && !dialogEl.open) {
        dialogEl.showModal()
    } else if (!isOpenValue && dialogEl.open) {
        dialogEl.close()
    }
})
</script>

<style module>

.dialog {
    --backdrop-bg-hsl: 0, 0%, 0%;
    --transition-duration: .5s;

    appearance: none;
    background: none;
    box-shadow: none;
    outline: none;
    border: none;
    padding: 20px;

    width: max-content;
    height: max-content;
    background: radial-gradient(ellipse at right top, rgba(0, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.3) 47%, rgba(0, 0, 0, 0.3) 100%);
    border: 1px solid #00ffff;
    box-shadow: #00ffff 0 0 7px;
    border-radius: 35px;
    overflow: hidden;

    transition: display var(--transition-duration) allow-discrete, overlay var(--transition-duration) allow-discrete;
    animation: ui-base-dialog-close var(--transition-duration) forwards;
}

.dialog[open] {
    animation: ui-base-dialog-open var(--transition-duration) forwards;
    animation-timing-function: cubic-bezier(0.38,0.56,0.62,1.4);
}

.dialog::backdrop {
    background-color: hsla(var(--backdrop-bg-hsl), .5);
    background-image: var(--backdrop-bg-img);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transition: display var(--transition-duration) allow-discrete, overlay var(--transition-duration) allow-discrete;
    animation: ui-base-dialog-backdrop-close var(--transition-duration) forwards;

    backdrop-filter: blur(10px);
}
.dialog[open]::backdrop {
  animation: ui-base-dialog-backdrop-open var(--transition-duration) forwards;
}

@keyframes ui-base-dialog-backdrop-open {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes ui-base-dialog-backdrop-close {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes ui-base-dialog-open {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes ui-base-dialog-close {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
}

.close-button {
    position: absolute;
    top: 2%;
    right: 2%;
    width: 36px;
    height: 36px;
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
</style>