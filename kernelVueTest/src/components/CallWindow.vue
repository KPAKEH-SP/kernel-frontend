<template>
    <div ref="root" :class="$style.wrapper" :style="styleList">
        <BaseWidget :class="$style.root">
            <UserAvatar :username="callRequest.senderUsername" :class="$style.avatar"/>
            <PhPhoneCall @click="emits('callAccepted')" :class="$style.accept" :size="40"/>
            <PhX @click="emits('callRejected')" :class="$style.reject" :size="40"/>
        </BaseWidget>
    </div>
</template>

<script setup>
    import BaseWidget from './ui/BaseWidget.vue';
    import { PhPhoneCall, PhX } from '@phosphor-icons/vue';
    import { useDraggable } from '@vueuse/core';
    import { computed, ref, watch } from 'vue';
    import UserAvatar from './ui/UserAvatar.vue';
    const startPositionX = window.innerWidth/2-100;
    const startPositionY = window.innerHeight/2-150;

    const emits = defineEmits(['callAccepted', 'callRejected']);
    const callRequest = defineModel('callRequest', {type: Object});

    const styleList = computed(() => {
        return {left: x.value/window.innerWidth*100 + '%',
            top: y.value/window.innerHeight*100 + '%'
        };
    });

    const root = ref(null);

    const { x, y, style } = useDraggable(root, {
        initialValue: { x: startPositionX, y: startPositionY },
    });
</script>

<style module>
    .root {
        display: flex;
        align-items: end;
        justify-content: center;
    }
    .wrapper {
        position: fixed;
        width: 200px;
        height: 300px;
    }

    .accept {
        transition: all 0.5s ease;
        margin: 10px;
        margin-bottom: 30px;
    }

    .accept:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);
        cursor: pointer;
    }

    .reject {
        transition: all 0.5s ease;
        margin: 10px;
        margin-bottom: 30px;
    }

    .reject:hover {
        color: #ff4343;
        filter: drop-shadow(0 0 5px #ff4343);
        cursor: pointer;
    }

    .avatar {
        align-self: center;
        position: absolute;
    }
</style>