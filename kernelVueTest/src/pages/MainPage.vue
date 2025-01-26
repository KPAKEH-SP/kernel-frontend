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
    import { useToken } from '@/composables/useToken';
    import { useCallData } from '@/composables/useCallData';
    import AudioChat from '@/components/AudioChat.vue';
    import CreateGroupChat from '@/components/CreateGroupChat.vue';
    import ChatSettings from '@/components/ChatSettings.vue';
    
    const { state:userDataState } = useUserData();
    const { stompClient } = useSharedWebStomp();
    const { callInterlocutor } = useCallData();
    const token = useToken();

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    const openedChatsPanel = ref(false);
    const openedChatWindow = ref(false);
    const openedAudioChat = ref(false);
    const openedCallWindow = ref(false);
    const openedCreateGroupChat = ref(false);
    const openedChatSettings = ref(false);

    const currentCallRequest = ref(null);

    const { handleOffer, handleAnswer, handleCandidate, disconnect, createOffer } = useWebRTC();

    watch(openedAudioChat, (state) => {
        if (state == false) {
            disconnect();
        }
    })
    
    stompClient.subscribe(`/topic/call/user/${userDataState.value.username}`, message => {
        const jsonMessage = JSON.parse(message.body);
        console.log("CALL REQUEST MESSGE >>> ", jsonMessage);
        if (jsonMessage.type == "REQUEST") {
            openedCallWindow.value = true;
            currentCallRequest.value = jsonMessage;
        } else if (jsonMessage.type == "ACCEPT") {
            console.log("CALL REQUEST ACCEPTED >>> ", jsonMessage);
            callInterlocutor.value = jsonMessage.sender;
            createOffer();
        } else if (jsonMessage.type == "REJECT") {
            console.log("CALL REUEST REJECTED >>> ", jsonMessage);
            openedCallWindow.value = false;
            callInterlocutor.value = null;
            currentCallRequest.value = null;
            disconnect();
        }
    });

    stompClient.subscribe(`/topic/webrtc/offer/user/${userDataState.value.username}`, message => {
        openedAudioChat.value = true;
        console.log("OPENED AUDIO CHAT >>> ", openedAudioChat.value);
        handleOffer(message);
    });

    stompClient.subscribe(`/topic/webrtc/answer/user/${userDataState.value.username}`, message => {
        handleAnswer(message);
    });

    stompClient.subscribe(`/topic/webrtc/candidate/user/${userDataState.value.username}`, message => {
        handleCandidate(message);
    });

    stompClient.subscribe(`/topic/notifications/${userDataState.value.username}`, (message) => {
        const text = message.body;
        const notification = new Notification("Kernel", { body: text });
    });

    const acceptCall = () => {
        const payload = {
            sender: token.value,
            type: "ACCEPT"
        };
        stompClient.send(`/kernel/call/user/${currentCallRequest.value.sender}`, JSON.stringify(payload));
        callInterlocutor.value = currentCallRequest.value.sender;
        openedCallWindow.value = false;
    }

    const rejectCall = () => {
        disconnect();
        const payload = {
            sender: token.value,
            type: "REJECT"
        };
        stompClient.send(`/kernel/call/user/${currentCallRequest.value.sender}`, JSON.stringify(payload));
        currentCallRequest.value = null;
        openedCallWindow.value = false;
        openedAudioChat.value = false;
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

    <Modal v-model:open="openedAudioChat">
        <AudioChat/>
    </Modal>

    <Modal v-model:open="openedCreateGroupChat">
        <CreateGroupChat/>
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
                v-model:openedCreateGroupChat="openedCreateGroupChat"
                class="chats-panel"/>
            </Transition>
            <Transition name="chat-window">
                <ChatWindow 
                v-if="openedChatWindow"
                v-model:openedAudioChat="openedAudioChat"
                v-model:openedChatSettings="openedChatSettings"/>
            </Transition>
            <Transition name="chat-settings">
                <ChatSettings
                v-if="openedChatSettings"/>
            </Transition>
        </div>
    </div>
</template>