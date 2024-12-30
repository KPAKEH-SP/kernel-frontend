<script setup>    
    import SockJS from 'sockjs-client';
    import Webstomp from 'webstomp-client';
    import { onMounted, ref, watch } from 'vue';
    import PrimaryButton from '@/components/ui/PrimaryButton.vue';
    import AccountPanel from '@/components/AccountPanel.vue';
    import FriendsPanel from '@/components/FriendsPanel.vue';
    import Modal from '@/components/ui/Modal.vue'
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import { useApi } from '@/composables/useApi';
    import { useWebsocket } from '@/composables/useWebsocket';
    import UpMenu from '@/components/UpMenu.vue';
    import { useSharedUsername } from '@/composables/useSharedUsername';
    import ChatsPanel from '@/components/ChatsPanel.vue';
    
    const storageToken = localStorage.getItem('token');
    const { username } = useSharedUsername();
    const friends = ref([]);
    const chats = ref([]);
    const messages = ref([]);
    const newMessage = ref('');
    const stompClient = ref(null);
    const currentChatId = ref();
    const currentChatName =ref();
    const userAvatar = ref();
    const notifications = ref([]);

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    const openedChatsPanel = ref(false);
    const openedChatWindow = ref(false);

    let historySubscription = null;
    let chatSubscription = null;
    
    const updateFriends = (friendsResponse) => {
        friends.value = [];

        let updatedFriends = [];
        
        for (const friend of friendsResponse) {
            if (friend.user.username === username.value){
                const avatar = getAvatar(friend.pendingFrom.username);
                updatedFriends.push({
                    avatar: avatar, 
                    firendUsername: friend.pendingFrom.username, 
                    status: friend.status,
                    pendingFrom: friend.pendingFrom.username});
            } else {
                const avatar = getAvatar(friend.user.username);
                updatedFriends.push({
                    avatar: avatar,
                    firendUsername: friend.user.username,
                    status: friend.status,
                    pendingFrom: friend.pendingFrom.username});

            }
        }

        friends.value = updatedFriends;
    }

    const getFriendsApi = useApi({url: "api/friends/get", method: "get"});

    const getFriends = async () => {
        try {
            if (storageToken != null) {
                getFriendsApi.execute()
                .then(function(response) {
                    updateFriends(response);
                });
            }
        } catch (error) {
             console.log(error);
        }
    }

    getFriends();
    
    const getNotificationsApi = useApi({url: "/api/notifications/get", method: "get"});

    const getNotifications = async () => {
        try {
            getNotificationsApi.execute()
            .then(function(response) {
                notifications.value = response;
            });
        } catch (error) {
            console.log(error);
        }
    }

    getNotifications();

    const removeFriendApi = useApi({url: "/api/friends/remove", method: "post"});

    const removeFriend = async (friendUsername) => {
        try {
            if (storageToken != null) {
                removeFriendApi.execute(0, {data: {username: friendUsername}})
                .then(function(response) {
                    updateFriends(response);
                });
            }
        } catch (error) {
             console.log(error);
        }
    }
    
    const addFriendApi = useApi({url: "/api/friends/add", method: "post"});

    const addFriend = (friendUsername) => {
        addFriendApi.execute(0, {data: {username: friendUsername}})
        .then(function (response) {
            updateFriends(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const acceptFriendApi = useApi({url: "/api/friends/accept", method: "post"});

    const acceptFriend = (friendUsername) => {
        acceptFriendApi.execute(0, {data: {username: friendUsername}})
        .then(function (response) {
            updateFriends(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const chatApi = useApi({url: "/api/chats/create", method: "post"});

    const chat = async (friendUsername) => {
        chatApi.execute(0, {data: {username: friendUsername}})
        .then(function (response) {
            getChats();
        })
        .catch(function (error) {
            if (error.status == 409) {
                openedFriendsPanel.value = false;
                connectToStompChat(error.response.data);
            }
        });
    }

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
    

    const friendsWebSocket = useWebsocket(`/topic/requests/friend/${username.value}`);
    friendsWebSocket.emitter.on('wsMessage', (message) =>  {
        const jsonMessage = JSON.parse(message.body);
        updateFriends(jsonMessage);
    });

    const connectToWebSocket = () => {
        const socket = new SockJS('/ws');
        stompClient.value = Webstomp.over(socket);
        stompClient.value.connect({}, () => {
            stompClient.value.subscribe(`/topic/notifications/${username.value}`, (message) => {
                getNotifications();

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
    
    const deleteMessageApi = useApi({url: "api/messages/delete", method: "post"})

    const deleteMessage = (messageId) => {
        deleteMessageApi.execute(0, {data: {chatId: currentChatId.value, messageId: messageId}})
        .catch(function (error) {
            console.log(error);
        });
    }
</script>

<template>
    <Modal v-model:open="openedAccountPanel">
        <AccountPanel :username="username"
        :token="storageToken"
        v-model:avatar="userAvatar"/>
    </Modal>

    <Modal v-model:open="openedFriendsPanel">
        <FriendsPanel :username="username"
        v-model:friends="friends"
        @openChat="chat" 
        @removeFriend="removeFriend"
        @addFriend="addFriend" 
        @accept="acceptFriend"/>
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
                v-model:openedChatsPanel="openedChatsPanel"/>
            </Transition>

            <div v-if="openedChatWindow" class="chat-window">
                <div class="chat-settings">
                    <div class="chat-name"> {{ currentChatName }}</div>
                    <div class="call"></div>
                </div>
                <div class="messages">
                    <div v-for="(message, index) in messages" :key="index" class="message">
                        <div class="user-avatar">
                            <img :src="message.senderAvatar" class="avatar-image" onerror="this.style.display='none';"/>
                        </div>
                        <div class="message-info">
                            <div class="author-info">
                                {{ message.data.sender }}
                            </div>
                            <div class="content">
                                {{ message.data.content }}
                            </div>
                            <div class="timestamp">
                                {{ message.data.timestamp }}
                            </div>
                        </div>
                        <div class="message-control">
                            <div v-if="message.data.sender == username" class="delete-message">
                                <PrimaryButton @click="deleteMessage(message.data.messageId)" text="del" size="" color="red"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="message-panel">
                    <input v-on:keyup.enter="sendMessage()" v-model="newMessage" class="message-input" type="text" placeholder="enter message">
                    <button @click="sendMessage()" class="message-button">Send</button>
                </div>
            </div>
        </div>
    </div>

</template>