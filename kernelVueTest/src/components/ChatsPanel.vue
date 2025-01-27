<template>
    <div :class="$style.wrapper">
        <BaseWidget :class="$style.widget">
           <ChatsFinder
           v-model:createGroupChat="openedCreateGroupChat"/>
            <svg width="85%" height="1" viewBox="0 0 263 1">
                <line y1="0.5" x2="263" y2="0.5" stroke="white"/>
            </svg>
            <ChatButton 
            v-for="(chat, index) in chats" 
            v-model:chatInfo="chats[index]"
            @click="connectToChat(chat.chatInfo.chatId)"/>
        </BaseWidget>
    </div>
</template>

<script setup>
    import { useSharedChats } from '@/composables/useSharedChats';
    import BaseWidget from './ui/BaseWidget.vue';
    import ChatsFinder from './ChatsFinder.vue';
    import ChatButton from './ChatButton.vue';

    const emit = defineEmits(["connectToChat"]);
    const { chats, setCurrentChat } = useSharedChats();
    const openedCreateGroupChat = defineModel('openedCreateGroupChat', {type: Boolean, default: false});
    const connectToChat = (chatId) => {
        emit('connectToChat');
        setCurrentChat(chatId);
    }
</script>

<style module>
    .wrapper {
        width: 15%;
        height: 100%;

        overflow: hidden;
    }

    .widget {
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        gap: 10px;
    }
</style>