<template>
        <div id="chats-panel" :class="$style['chats-panel']">
            <div :class="$style.chat" v-for="chat in chats">
                <button :class="$style['chat-button']" @click="emit('connectToChat', chat.chatInfo.chatId)">
                    <div :class="$style['chat-avatar']">
                        <img :src="chat.chatAvatar" class="avatar-image" onerror="this.style.display='none';"/>
                    </div> 
                    <div :class="$style['chat-name']">
                        {{ chat.chatName }}
                    </div>
                </button>
            </div>
        </div>
</template>

<script setup>
    import { useSharedChats } from '@/composables/useSharedChats';

    const emit = defineEmits(["connectToChat"]);
    const { chats } = useSharedChats();
</script>

<style module>
    .chats-panel {
        width: 15%;
        border-right: 3px solid #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }

    .chat {
        display: flex;
        width: 98%;
        margin: 2%;
    }

    .chat-button {
        display: flex;
        flex-grow: 1;
        background: transparent;
        border: solid #fff 2px;
        color: #fff;
        border-radius: 5px;
        transition: all 0.5s ease;
    }

    .chat-button:hover {
        border-radius: 10vh;
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-color: #00ffff;
        color: #00ffff;
    }

    .chat-avatar {
        height: 50px;
        width: 50px;
        border: solid #fff 1px;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        position: relative;
        display: flex;
        align-items: center;
    }

    .chat-name {
        margin-left: 5%;
        align-self: center;
    }
</style>