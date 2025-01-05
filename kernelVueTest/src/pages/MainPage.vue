<script setup>    
    import { ref, watch } from 'vue';
    import AccountPanel from '@/components/AccountPanel.vue';
    import FriendsPanel from '@/components/FriendsPanel.vue';
    import Modal from '@/components/ui/Modal.vue'
    import UpMenu from '@/components/UpMenu.vue';
    import { useSharedUsername } from '@/composables/useSharedUsername';
    import ChatsPanel from '@/components/ChatsPanel.vue';
    import { useWebRTC } from '@/composables/useWebRTC';
    import { useSharedWebStomp } from '@/composables/useSharedWebStomp';
    import ChatWindow from '@/components/ChatWindow.vue';
    
    const { username } = useSharedUsername();
    const { stompClient } = useSharedWebStomp();

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    const openedChatsPanel = ref(false);
    const openedChatWindow = ref(false);
    const openedViedoChat = ref(false);

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

    const connectToWebSocket = () => {
        stompClient.subscribe(`/topic/notifications/${username.value}`, (message) => {
            const text = message.body;
            const notification = new Notification("Kernel", { body: text });
        });

        return stompClient;
    }

    connectToWebSocket();
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
                @connectToChat="openedChatWindow = true"
                class="chats-panel"/>
            </Transition>

            <ChatWindow v-if="openedChatWindow"/>
        </div>
    </div>
</template>