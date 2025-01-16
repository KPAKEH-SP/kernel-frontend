<template>
    <div :class="$style['chats-panel']">
        <BaseWidget>
            <div :class="$style['chats-options']">
                <PhPlus @click="openedCreateGroupChat = true" :class="$style['options-button']" :size="30"/>
            </div>
            <div :class="$style.chat" v-for="chat in chats">
                <button :class="$style['chat-button']" @click="connectToChat(chat.chatInfo.chatId)">
                    <div v-if="chat.type == 'personal'">
                        <UserAvatar :class="$style['avatar-wrapper']" :username="chat.chatInfo.companion"/>
                        <div :class="$style['chat-name']">
                            {{ chat.chatInfo.companion }}
                        </div>
                    </div>
                    
                    <div v-if="chat.type == 'group'">
                        <div :class="$style['group-chat-avatar']">
                            <UserAvatar :class="$style['avatar-wrapper']" :username="chat.chatInfo.users[0].username"/>
                            <UserAvatar :class="$style['group-avatar-wrapper']" :username="chat.chatInfo.users[1].username"/>
                            <UserAvatar :class="$style['group-avatar-wrapper']" :username="chat.chatInfo.users[2].username"/>
                        </div>
                        <div :class="$style['chat-name']">
                            {{ chat.chatInfo.chatName }}
                        </div>
                    </div>
                </button>
            </div>
        </BaseWidget>
    </div>
</template>

<script setup>
    import { useSharedChats } from '@/composables/useSharedChats';
    import { PhPlus } from '@phosphor-icons/vue';
    import BaseWidget from './ui/BaseWidget.vue';
    import UserAvatar from './ui/UserAvatar.vue';

    const emit = defineEmits(["connectToChat"]);
    const { chats, setCurrentChat } = useSharedChats();
    const openedCreateGroupChat = defineModel('openedCreateGroupChat', {type: Boolean, default: false});
    const connectToChat = (chatId) => {
        emit('connectToChat');
        setCurrentChat(chatId);
    }
</script>

<style module>
    .chats-panel {
        width: 15%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        z-index: 10;
        margin: 10px;
        margin-right: 5px;
    }

    .chat {
        margin: 1vh;
        display: flex;
        width: 95%;
    }

    .chat-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        background: transparent;
        border: solid #fff 1px;
        color: #fff;
        border-radius: 10vh;
        transition: all 0.5s ease;
    }

    .chat-button:hover {
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-color: #00ffff;
        color: #00ffff;
    }

    .group-chat-avatar {
        display: flex;
    }

    .chat-name {
        align-self: center;
    }

    .chats-options {
        display: flex;
        align-items: center;
        justify-content: center;
        border: solid #fff 1px;
        margin: 1vh;
        width: 95%;
        border-radius: 10vh;
    }

    .options-button {
        color: #fff;
        transition: all 0.5s ease;
    }

    .options-button:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);
        cursor: pointer;
    }

    .avatar-wrapper {
        height: 50px;
        width: 50px;
        z-index: 10;
    }

    .group-avatar-wrapper {
        height: 50px;
        width: 50px;
        margin-left: -10px;
        z-index: 5;
    }
</style>