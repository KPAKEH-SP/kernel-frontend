<script setup>    
    import SockJS from 'sockjs-client';
    import Webstomp from 'webstomp-client';
    import { ref } from 'vue';
    import PrimaryButton from '@/components/ui/PrimaryButton.vue';
    import AccountPanel from '@/components/AccountPanel.vue';
    import FriendsPanel from '@/components/FriendsPanel.vue';
    import Modal from '@/components/ui/Modal.vue'
    import { router } from '@/router';
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import { PhArrowDown, PhBell, PhCaretCircleDown, PhCaretLineDown, PhChatsCircle, PhGear, PhUsers } from '@phosphor-icons/vue';
    import { useApi } from '@/composables/useApi';
    
    const storageToken = localStorage.getItem('token');
    const username = ref('');
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

    const updateChats = async (chatsResponse) => {
        chats.value = [];

        for (const chat of chatsResponse) {
            if (chat.users.length == 2) {
                let updatedChats = [];

                for (const user of chat.users) {
                    if (user.username != username.value) {
                        const avatar = getAvatar(user.username);
                        updatedChats.push({ chatAvatar: avatar, chatName: user.username, chatInfo: chat });
                    }
                }

                updatedChats.forEach(updatedChat => {
                    chats.value.push(updatedChat);
                });
            }
        }

        console.log('Chats list formed: ');
        console.log(chats);
    };

    const getChatsApi = useApi({url: "/api/chats/get", method: "get"});

    const getChats = async () => {
        try {
            if (storageToken != null) {
                getChatsApi.execute()
                .then(function(response) {
                    updateChats(response);
                    console.log(chats);
                });
            }
        } catch (error) {
                console.log(error);
        }
    }
    
    const updateFriends = (friendsResponse) => {
        console.log("FRIENDS RESPONSE >>> ", friendsResponse);

        friends.value = [];

        let updatedFriends = [];
        
        for (const friend of friendsResponse) {
            const avatar = getAvatar(friend.user.username);
            updatedFriends.push({friendAvatar: avatar, friendObj: friend});
        }

        friends.value = updatedFriends;
    }

    const getFrindsApi = useApi({url: "api/friends/get", method: "get"});

    const getFriends = async () => {
        try {
            if (storageToken != null) {
                getFrindsApi.execute()
                .then(function(response) {
                    updateFriends(response);
                    console.log(friends);
                });
            }
        } catch (error) {
             console.log(error);
        }
    }
    
    const getNotificationsApi = useApi({url: "/api/notifications/get", method: "get"});

    const getNotifications = async () => {
        try {
            getNotificationsApi.execute()
            .then(function(response) {
                notifications.value = response;
                console.log("NOTIFICATIONS >>> ", notifications);
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    const getUserApi = useApi({url: "/api/auth/user-info", method: "get"});

    const checkToken = async () => {
        try {
            if (storageToken != null) {   
                await getUserApi.execute()
                .then(function(response) {
                    console.log(response);
                    username.value = response.username;
                    getFriends();
                    getChats();
                    getNotifications();
                    userAvatar.value = getAvatar(username.value, true);
                });
            } else {
                throw new Error("token is empty");
            }
        } catch (error) {
            console.log(error);
            console.log('Redirect to: /auth');
            router.push({path: '/auth'});
        }
    }

    checkToken();

    const removeFriendApi = useApi({url: "/api/friends/remove", method: "post"});

    const removeFriend = async (friendUsername) => {
        try {
            if (storageToken != null) {
                console.log(friendUsername);
                removeFriendApi.execute(0, {data: {username: friendUsername}})
                .then(function(response) {
                    console.log(response);
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
            console.log(response);
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
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const chatApi = useApi({url: "/api/chats/create", method: "post"});


    const chat = async (friendUsername) => {
        chatApi.execute(0, {data: {username: friendUsername}})
        .then(function (response) {
            console.log(response);
            updateChats(response);
        })
        .catch(function (error) {
            if (error.status == 409) {
                connectToStompChat(error.response.data.message);
                openedFriendsPanel.value = false;
                openedChatsPanel.value = true;
            }
            console.log(error);
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
                console.log(messages);
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
            console.log('WebSocket connected!');
            stompClient.value.subscribe(`/topic/requests/friend/${username.value}`, (message) => {
                getFriends();
                console.log(message);
            });

            console.log(stompClient.value);

            stompClient.value.subscribe(`/topic/notifications/${username.value}`, (message) => {
                getNotifications();
                console.log(message);

                const text = message.body;
                const notification = new Notification("Kernel", { body: text });
            });

            console.log(stompClient.value);
        });

        return stompClient;
    }

    connectToWebSocket();

    const sendMessage = () => {
        if (newMessage.value.trim() && stompClient.value && stompClient.value.connected) {
            let chatId = currentChatId.value;

            const payload = {
                sender: storageToken,
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
        <div class="up-menu">
            <PhChatsCircle @click="openedChatsPanel = (!openedChatsPanel)" class="up-item" :size="40"/>
            <PhUsers @click="openedFriendsPanel = true" class="up-item" :size="40"/>
            <div class="account-notifications-wrapper">
                <PhBell class="account-notifications":size="40"/>
                <div class="notifications-menu">
                </div>
            </div>
            <div class="account-button">
                <div class="avatar-wrapper">
                    <img :src="userAvatar" class="avatar-image" onerror="this.style.display='none';"/>
                </div>

                <div class="status">
                    
                </div>
                <div class="account-menu">
                    <PhGear class="account-settings" @click="openedAccountPanel = true" :size="30"/>
                </div>
            </div>
            <div class="open-up-menu">
                <PhCaretLineDown :size="30"/>
            </div>
        </div>
        <div class="main-plane">
            <div v-if="openedChatsPanel" id="chats-panel" class="chats-panel">
                <div class="chat" v-for="chat in chats">
                    <button class="chat-button" @click="connectToStompChat(chat.chatInfo.chatId)">
                        <div class="chat-avatar">
                            <img :src="chat.chatAvatar" class="avatar-image" onerror="this.style.display='none';"/>
                        </div> 
                        <div class="chat-name">
                            {{ chat.chatName }}
                        </div>
                    </button>
                </div>
            </div>
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