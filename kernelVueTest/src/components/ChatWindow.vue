<template>
    <Modal v-model:open="openedAudioChat">
        <AudioChat/>
    </Modal>

    <BaseWidget :class="$style['chat-window']">
        <div :class="$style['chat-settings']">
            <div> {{ currentChat.chatName }}</div>
            <button @click="openAudioChat()"> Call </button>
        </div>
        <Messages v-model:messages="messages" :chat-id="currentChat.chatInfo.chatId"/>
        <div :class="$style['message-panel']">
            <input v-on:keyup.enter="sendMessage()" v-model="newMessage" :class="$style['message-input']" type="text" placeholder="enter message">
            <button @click="sendMessage()" :class="$style['message-button']">Send</button>
        </div>
    </BaseWidget>
</template>

<script setup>
    import { useWebRTC } from '@/composables/useWebRTC';
    import AudioChat from './AudioChat.vue';
    import BaseWidget from './ui/BaseWidget.vue';
    import Modal from './ui/Modal.vue';
    import { useSharedChats } from '@/composables/useSharedChats';
    import { onMounted, ref } from 'vue';
    import Messages from './Messages.vue';
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import { useSharedWebStomp } from '@/composables/useSharedWebStomp';
import { useToken } from '@/composables/useToken';

    const { createOffer } = useWebRTC();
    const { currentChat } = useSharedChats();
    const { stompClient } = useSharedWebStomp();
    const openedAudioChat = ref(false);

    let historySubscription = null;
    let chatSubscription = null;

    const messages = ref([]);
    const newMessage = ref('');

    const storageToken = useToken();

    onMounted(() => {
        if (historySubscription) {
            historySubscription.unsubscribe();
            historySubscription = null;
        }
        if (chatSubscription) {
            chatSubscription.unsubscribe();
            chatSubscription = null;
        }

        historySubscription = stompClient.subscribe(`/topic/chat/history/${currentChat.value.chatInfo.chatId}`, (message) => {
            const historyMessages = JSON.parse(message.body);
            messages.value = [];
            for(const message of historyMessages) {
                const avatar = getAvatar(message.sender);
                
                const newMessage = {senderAvatar: avatar, data: message};
                messages.value.push(newMessage);
            }
        });

        chatSubscription = stompClient.subscribe(`/topic/chat/${currentChat.value.chatInfo.chatId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            const avatar = getAvatar(receivedMessage.sender)
            const newMessage = {senderAvatar: avatar, data: receivedMessage};
            messages.value.push(newMessage);
        });
        
        stompClient.send(`/kernel/chat/history/${currentChat.value.chatInfo.chatId}`, {}, {});
    });

    const openAudioChat = () => {
        createOffer();
        openedAudioChat.value = true;
    }

    const sendMessage = () => {
        if (newMessage.value.trim()) {
            const payload = {
                token: storageToken.value,
                content: newMessage.value
            };
            stompClient.send(`/kernel/chat/${currentChat.value.chatInfo.chatId}`, JSON.stringify(payload));
            newMessage.value = '';
        }
    };
</script>

<style module>
    .chat-window {
        display: flex;
        height: auto;
        box-sizing: border-box;
        width: 100%;
        flex-direction: column;
        margin: 10px;
        margin-top: 5px;
        margin-left: 5px;
    }

    .chat-settings {
        width: 100%;
        height: 10vh;
        border-bottom: solid #ffffff;
    }

    .message-panel {
        width: 100%;
        display: flex;
        align-self: end;
    }

    .message-input {
        font-family: "Roboto Mono", monospace;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: var(--font-size);
        line-height: var(--font-size);

        background: transparent;
        color: #ffffff;
        border-color: solid #ffffff;

        border: none;
        border-bottom: solid #ffffff;
        min-height: 3vh;

        outline: none;
        text-align: center;
        flex-grow: 1;

        transition: 0.3s ease;        
        margin: 10px;
        margin-right: 5px;
    }

    .message-input:hover, .message-input:focus {
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-radius: 10vh;
        border-color: #00ffff;
        border-top: solid;
        border-left: solid;
        border-right: solid;
        border-bottom: solid;
        color: #00ffff;
    }

    .message-button {
        background: transparent;
        color: #ffffff;
        border-color: solid #ffffff;
        border-radius: 0px;
        border: none;
        border-bottom: solid #ffffff;
        outline: none;
        text-align: center;
        transition: 0.3s ease;
        margin: 10px;
        margin-left: 5px;
    }

    .message-button:hover {
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

