<script setup>    
    import SockJS from 'sockjs-client';
    import Webstomp from 'webstomp-client';
    import { ref } from 'vue';
    import AccountPanel from '@/components/AccountPanel.vue';
    import FriendsPanel from '@/components/FriendsPanel.vue';
    import Modal from '@/components/ui/Modal.vue'
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import UpMenu from '@/components/UpMenu.vue';
    import { useSharedUsername } from '@/composables/useSharedUsername';
    import ChatsPanel from '@/components/ChatsPanel.vue';
    import { useSharedChats } from '@/composables/useSharedChats';
    import Messages from '@/components/Messages.vue';
    
    const storageToken = localStorage.getItem('token');
    const { username } = useSharedUsername();
    const { chats } = useSharedChats();
    const messages = ref([]);
    const newMessage = ref('');
    const stompClient = ref(null);
    const currentChatId = ref();
    const currentChatName =ref();

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    const openedChatsPanel = ref(false);
    const openedChatWindow = ref(false);

    let historySubscription = null;
    let chatSubscription = null;

    const connectToStompChat = (chatId) => {
        if (historySubscription) {
            historySubscription.unsubscribe();
            historySubscription = null;
        }
        if (chatSubscription) {
            chatSubscription.unsubscribe();
            chatSubscription = null;
        }

        const socket = new SockJS('/ws');
        stompClient.value = Webstomp.over(socket);

        currentChatId.value = chatId;
        currentChatName.value = chats.value.find(chat => chat.chatInfo.chatId === chatId).chatName;

        stompClient.value.connect({}, () => {
            historySubscription = stompClient.value.subscribe(`/topic/chat/history/${chatId}`, (message) => {
                const historyMessages = JSON.parse(message.body);
                messages.value = [];
                for(const message of historyMessages) {
                    const avatar = getAvatar(message.sender);
                    
                    const newMessage = {senderAvatar: avatar, data: message};
                    messages.value.push(newMessage);
                }
            });

            chatSubscription = stompClient.value.subscribe(`/topic/chat/${chatId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                const avatar = getAvatar(receivedMessage.sender)
                const newMessage = {senderAvatar: avatar, data: receivedMessage};
                messages.value.push(newMessage);
            });
            
            openedChatWindow.value = true;
            stompClient.value.send(`/kernel/chat/history/${chatId}`, {}, {});
        }, (error) => {
            console.error('WebSocket connection error:', error);
        });
    };

    const connectToWebSocket = () => {
        const socket = new SockJS('/ws');
        stompClient.value = Webstomp.over(socket);
        stompClient.value.connect({}, () => {
            stompClient.value.subscribe(`/topic/notifications/${username.value}`, (message) => {
                const text = message.body;
                const notification = new Notification("Kernel", { body: text });
            });
        });

        return stompClient;
    }

    connectToWebSocket();

    const sendMessage = () => {
        if (newMessage.value.trim() && stompClient.value && stompClient.value.connected) {
            let chatId = currentChatId.value;

            const payload = {
                token: storageToken,
                content: newMessage.value
            };
            stompClient.value.send(`/kernel/chat/${chatId}`, JSON.stringify(payload));
            newMessage.value = '';
        }
    };
</script>

<template>
    <Modal v-model:open="openedAccountPanel">
        <AccountPanel/>
    </Modal>

    <Modal v-model:open="openedFriendsPanel">
        <FriendsPanel/>
    </Modal>

    <div class="main-container">
        <UpMenu v-model:openedAccountPanel="openedAccountPanel"
        v-model:openedFriendsPanel="openedFriendsPanel"
        v-model:openedChatsPanel="openedChatsPanel"
        :username="username"/>
        <div class="main-plane">
            <Transition name="chats-panel">
                <ChatsPanel 
                v-if="openedChatsPanel"
                v-model:chats="chats"
                @connectToChat="connectToStompChat"
                class="chats-panel"/>
            </Transition>

            <div v-if="openedChatWindow" class="chat-window">
                <div class="chat-settings">
                    <div class="chat-name"> {{ currentChatName }}</div>
                    <div class="call"></div>
                </div>
                <Messages v-model:messages="messages"/>
                <div class="message-panel">
                    <input v-on:keyup.enter="sendMessage()" v-model="newMessage" class="message-input" type="text" placeholder="enter message">
                    <button @click="sendMessage()" class="message-button">Send</button>
                </div>
            </div>
        </div>
    </div>

</template>