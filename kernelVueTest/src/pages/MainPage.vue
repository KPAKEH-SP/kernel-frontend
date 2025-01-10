<script setup>    
    import { ref, watch } from 'vue';
    import AccountPanel from '@/components/AccountPanel.vue';
    import FriendsPanel from '@/components/FriendsPanel.vue';
    import Modal from '@/components/ui/Modal.vue'
    import UpMenu from '@/components/UpMenu.vue';
    import { useUserData } from '@/composables/useUserData';
    import ChatsPanel from '@/components/ChatsPanel.vue';
    import { useWebRTC } from '@/composables/useWebRTC';
    import { useSharedWebStomp } from '@/composables/useSharedWebStomp';
    import ChatWindow from '@/components/ChatWindow.vue';
    import CallWindow from '@/components/CallWindow.vue';
    import { useSharedChats } from '@/composables/useSharedChats';
    import { useToken } from '@/composables/useToken';
    import { useCallData } from '@/composables/useCallData';
    
    const { state:userDataState } = useUserData();
    const { stompClient } = useSharedWebStomp();
    const { currentChat, setCurrentChat } = useSharedChats(); 
    const { callInterlocutor } = useCallData();
    const token = useToken();

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    const openedChatsPanel = ref(false);
    const openedChatWindow = ref(false);
    const openedAudioChat = ref(false);
    const openedCallWindow = ref(false);

    const currentCallRequest = ref(null);

    const { handleOffer, handleAnswer, handleCandidate, disconnect, createOffer } = useWebRTC();

    watch(openedAudioChat, (state) => {
        if (state == false) {
            disconnect();
        }
    })
    
    stompClient.subscribe(`/topic/webrtc/user/offer/${userDataState.value.username}`, message => {
        openedAudioChat.value = true;
        console.log("OPENED AUDIO CHAT >>> ", openedAudioChat.value);
        handleOffer(message);
    });

    stompClient.subscribe(`/topic/webrtc/user/answer/${userDataState.value.username}`, message => {
        handleAnswer(message);
    });

    stompClient.subscribe(`/topic/webrtc/user/candidate/${userDataState.value.username}`, message => {
        handleCandidate(message);
    });

    stompClient.subscribe(`/topic/user/call/request/${userDataState.value.username}`, message => {
        currentCallRequest.value = JSON.parse(message.body);
        openedCallWindow.value = true;
        console.log("CURRENT CALL REQUEST >>> ", currentCallRequest.value);
    });
    
    stompClient.subscribe(`/topic/user/call/accept/${userDataState.value.username}`, message => {
        callInterlocutor.value = currentChat.value.chatInfo.companion;
        createOffer();
    });

    stompClient.subscribe(`/topic/user/call/reject/${userDataState.value.usernamee}`, message => {
        disconnect();
    });

    stompClient.subscribe(`/topic/notifications/${userDataState.value.username}`, (message) => {
        const text = message.body;
        const notification = new Notification("Kernel", { body: text });
    });



    const acceptCall = () => {
        setCurrentChat(currentCallRequest.value.chatId);
        openedChatWindow.value = true;
        const payload = {
            chatId: currentCallRequest.value.chatId,
            senderToken: token.value,
            respondentUsername: currentCallRequest.value.senderUsername,
            type: "ACCEPT"
        };
        stompClient.send(`/kernel/user/call`, JSON.stringify(payload));
        callInterlocutor.value = currentCallRequest.value.senderUsername;
        openedCallWindow.value = false;
    }

    const rejectCall = () => {
        disconnect();
        const payload = {
            chatId: currentCallRequest.value.chatId,
            senderToken: token.value,
            respondentUsername: currentCallRequest.value.senderUsername,
            type: "REJECT"
        };
        stompClient.send(`/kernel/user/call`, JSON.stringify(payload));
        currentCallRequest.value = null;
        openedCallWindow.value = false;
        openedAudioChat.value = false
    }
</script>

<template>
    <CallWindow 
    v-if="openedCallWindow"
    v-model:callRequest="currentCallRequest"
    @call-rejected="rejectCall"
    @call-accepted="acceptCall"/>

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
        :username="userDataState.username"/>
        <div class="main-plane">
            <Transition name="chats-panel">
                <ChatsPanel 
                v-if="openedChatsPanel"
                @connectToChat="openedChatWindow = true"
                class="chats-panel"/>
            </Transition>
            <ChatWindow 
            v-if="openedChatWindow"
            v-model:openedAudioChat="openedAudioChat"/>
        </div>
    </div>
</template>