<script setup>    
    import { ref, watch } from 'vue';
    import AccountPanel from '@/components/AccountPanel.vue';
    import FriendsPanel from '@/components/FriendsPanel.vue';
    import Modal from '@/components/ui/Modal.vue'
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import UpMenu from '@/components/UpMenu.vue';
    import { useSharedUsername } from '@/composables/useSharedUsername';
    import ChatsPanel from '@/components/ChatsPanel.vue';
    import { useSharedChats } from '@/composables/useSharedChats';
    import Messages from '@/components/Messages.vue';
    import ViedoChat from '@/components/ViedoChat.vue';
    import { useWebRTC } from '@/composables/useWebRTC';
    import { useSharedCurrentChatId } from '@/composables/useSharedCurrentChatId';
    import { useSharedWebStomp } from '@/composables/useSharedWebStomp';
    
    const storageToken = localStorage.getItem('token');
    const { username } = useSharedUsername();
    const { chats } = useSharedChats();
    const messages = ref([]);
    const newMessage = ref('');
    const currentChatName = ref();
    const { setChatId, currentChatId } = useSharedCurrentChatId();
    const { stompClient } = useSharedWebStomp();

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    const openedChatsPanel = ref(false);
    const openedChatWindow = ref(false);
    const openedViedoChat = ref(false);

    let historySubscription = null;
    let chatSubscription = null;

    const { handleOffer, handleAnswer, handleCandidate, createOffer, disconnect } = useWebRTC();

    watch(openedViedoChat, (state) => {
        if (state == false) {
            disconnect();
        }
    })
    
    stompClient.subscribe(`/topic/webrtc/user/offer/${username.value}`, message => {
        openedViedoChat.value = true;
        handleOffer(message);
    });

    stompClient.subscribe(`/topic/webrtc/user/answer/${username.value}`, message => {
        handleAnswer(message);
    });

    stompClient.subscribe(`/topic/webrtc/user/candidate/${username.value}`, message => {
        handleCandidate(message);
    });

    const connectToStompChat = (chatId) => {
        if (historySubscription) {
            historySubscription.unsubscribe();
            historySubscription = null;
        }
        if (chatSubscription) {
            chatSubscription.unsubscribe();
            chatSubscription = null;
        }

        setChatId(chatId);

        currentChatName.value = chats.value.find(chat => chat.chatInfo.chatId === chatId).chatName;

        historySubscription = stompClient.subscribe(`/topic/chat/history/${chatId}`, (message) => {
            const historyMessages = JSON.parse(message.body);
            messages.value = [];
            for(const message of historyMessages) {
                const avatar = getAvatar(message.sender);
                
                const newMessage = {senderAvatar: avatar, data: message};
                messages.value.push(newMessage);
            }
        });

        chatSubscription = stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            const avatar = getAvatar(receivedMessage.sender)
            const newMessage = {senderAvatar: avatar, data: receivedMessage};
            messages.value.push(newMessage);
        });
        
        openedChatWindow.value = true;
        stompClient.send(`/kernel/chat/history/${chatId}`, {}, {});

    };

    const connectToWebSocket = () => {
        stompClient.subscribe(`/topic/notifications/${username.value}`, (message) => {
            const text = message.body;
            const notification = new Notification("Kernel", { body: text });
        });

        return stompClient;
    }

    connectToWebSocket();

    const sendMessage = () => {
        if (newMessage.value.trim()) {
            const payload = {
                token: storageToken,
                content: newMessage.value
            };
            stompClient.send(`/kernel/chat/${currentChatId.value}`, JSON.stringify(payload));
            newMessage.value = '';
        }
    };

    const openViedoChat = () => {
        createOffer();
        openedViedoChat.value = true;
    }
</script>

<template>
    <Modal v-model:open="openedAccountPanel">
        <AccountPanel/>
    </Modal>

    <Modal v-model:open="openedFriendsPanel">
        <FriendsPanel/>
    </Modal>

    <Modal v-model:open="openedViedoChat">
        <ViedoChat/>
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
                @connectToChat="connectToStompChat"
                class="chats-panel"/>
            </Transition>

            <div v-if="openedChatWindow" class="chat-window">
                <div class="chat-settings">
                    <div class="chat-name"> {{ currentChatName }}</div>
                    <button @click="openViedoChat()"> Call </button>
                </div>
                <Messages v-model:messages="messages" :chat-id="currentChatId"/>
                <div class="message-panel">
                    <input v-on:keyup.enter="sendMessage()" v-model="newMessage" class="message-input" type="text" placeholder="enter message">
                    <button @click="sendMessage()" class="message-button">Send</button>
                </div>
            </div>
        </div>
    </div>

</template>