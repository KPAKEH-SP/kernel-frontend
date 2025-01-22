<template>
    <div :class="$style.wrapper">
        <BaseWidget :class="$style['chat-name']">
            <div v-if="currentChat.type == 'personal'" :class="$style['chat-name-text']">
                {{ currentChat.chatInfo.companion }}
            </div>

            <div v-if="currentChat.type == 'group'" :class="$style['chat-name-text']">
                {{ currentChat.chatInfo.chatName }}
            </div>
        </BaseWidget>

        <BaseWidget :class="$style['chat-window']">
            <Messages v-model:messages="messages" :chat-id="currentChat.chatInfo.chatId"/>
        </BaseWidget>
    </div>
    <!--BaseWidget :class="$style['chat-window']">
        <div :class="$style['chat-settings']">
            <div v-if="currentChat.type == 'personal'">
                <div> {{ currentChat.chatInfo.companion }}</div>
                <PhPhoneCall :class="$style['settings-button']" @click="openAudioChat()" :size="30"/>
            </div>

            <div v-if="currentChat.type == 'group'">
                
            </div>
        </div>
        <Messages v-model:messages="messages" :chat-id="currentChat.chatInfo.chatId"/>
        <div :class="$style['message-panel']">
            <input v-on:keyup.enter="sendMessage()" v-model="newMessage" :class="$style['message-input']" type="text" placeholder="enter message">
            <button @click="sendMessage()" :class="$style['message-button']">Send</button>
        </div>
    </BaseWidget-->
</template>

<script setup>
    import BaseWidget from './ui/BaseWidget.vue';
    import { useSharedChats } from '@/composables/useSharedChats';
    import { onMounted, ref } from 'vue';
    import Messages from './Messages.vue';
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import { useSharedWebStomp } from '@/composables/useSharedWebStomp';
    import { useToken } from '@/composables/useToken';
    import { PhPhoneCall } from '@phosphor-icons/vue';
    import { useApi } from '@/composables/useApi';

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
    }

    const deleteMessageApi = useApi({url: "api/messages/delete", method: "post"})
    const deleteMessage = (messageId) => {
        deleteMessageApi.execute(0, {data: {chatId: props.chatId, messageId: messageId}})
        .catch(function (error) {
            console.log(error);
        });
    }

    const changeChatNameApi = useApi({url: "api/chats/change/name", method: "post"})
    const changeChatName = () => {
        changeChatNameApi.execute(0, {data: {
            id: currentChat.value.chatInfo.chatId,
            newChatName: chatName.value
        }})
    }
</script>

<style module>
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 10px;

        width: 100%;
        height: 100%;
    }

    .chat-name {
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 10px;

        width: 100%;
        height: 60px;
    }

    .chat-name-text {
        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 20px;
        display: flex;
        align-items: center;

        color: #FFFFFF;
    }

    .chat-window {
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        gap: 16px;

        width: 100%;
        height: 100%;

        overflow-y: scroll;
        overflow-y: auto;
        scrollbar-width: none;
    }
/*
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

    input {
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
        min-height: 3vh;

        outline: none;
        text-align: center;
        flex-grow: 1;

        transition: 0.3s ease;        
        margin: 10px;
        margin-right: 5px;
    }

    input:hover, input:focus {
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
*/
</style>

