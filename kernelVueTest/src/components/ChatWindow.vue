<template>
    <BaseWidget :class="$style['chat-window']">
        <div :class="$style['chat-settings']">
            <div> {{ chatName }}</div>
            <PhPhoneCall :class="$style['settings-button']" @click="openAudioChat()" :size="30"/>
        </div>
        <Messages v-model:messages="messages" :chat-id="currentChat.chatInfo.chatId"/>
        <div :class="$style['message-panel']">
            <input v-on:keyup.enter="sendMessage()" v-model="newMessage" :class="$style['message-input']" type="text" placeholder="enter message">
            <button @click="sendMessage()" :class="$style['message-button']">Send</button>
        </div>
    </BaseWidget>
</template>

<script setup>
    import AudioChat from './AudioChat.vue';
    import BaseWidget from './ui/BaseWidget.vue';
    import Modal from './ui/Modal.vue';
    import { useSharedChats } from '@/composables/useSharedChats';
    import { onMounted, ref } from 'vue';
    import Messages from './Messages.vue';
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import { useSharedWebStomp } from '@/composables/useSharedWebStomp';
    import { useToken } from '@/composables/useToken';
    import { PhPhoneCall } from '@phosphor-icons/vue';

    const { currentChat } = useSharedChats();
    const { stompClient } = useSharedWebStomp();
    const openedAudioChat = defineModel('openedAudioChat', { type: Boolean });

    let historySubscription = null;
    let chatSubscription = null;

    const messages = ref([]);
    const newMessage = ref('');
    const chatName = ref('');

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

        if (currentChat.value.type == "personal") {
            chatName.value = currentChat.value.chatInfo.companion;
        } else if (currentChat.value.type == "group") {
            chatName.value = currentChat.value.chatInfo.chatName;
        }
    });

    const openAudioChat = () => {
        const payload = {
            sender: storageToken.value,
            type: "REQUEST"
        }; 
        stompClient.send(`/kernel/call/user/${currentChat.value.chatInfo.companion}`, JSON.stringify(payload));

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
        margin-left: 5px;
    }

    .chat-settings {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 10vh;
        border-bottom: solid #ffffff;
        align-items: center;
        justify-content: center;
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

    .settings-button {
        color: #fff;
        transition: all 0.5s ease;
    }

    .settings-button:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);
        cursor: pointer;
    }
</style>

