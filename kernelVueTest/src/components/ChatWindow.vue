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
            <input v-on:keyup.enter="sendMessage()" v-model="newMessage" :class="$style['message-input']"
            placeholder="Type message here..."/>
        </BaseWidget>
    </div>
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
        height: calc(100% - 60px);
    }

    .message-input {
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 20px;
        gap: auto;

        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 37px;

        color: #D8D8D8;

        width: 100%;
        height: max-content;

        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(20px);
        border-radius: 30px;
    }
</style>

