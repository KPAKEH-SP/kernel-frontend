<script setup>    
    import SockJS from 'sockjs-client';
    import Webstomp from 'webstomp-client';
    import { ref } from 'vue';
    import PrimaryButton from '@/components/ui/PrimaryButton.vue';
    import AccountPanel from '@/components/AccountPanel.vue';
    import FriendsPanel from '@/components/FriendsPanel.vue';
    import Modal from '@/components/ui/Modal.vue'
    import { router } from '@/router';
    import axios, { AxiosError } from 'axios';
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    
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

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    const openedChatsPanel = ref(false);
    const openedChatWindow = ref(false);

    let historySubscription = null;
    let chatSubscription = null;

    const updateChats = async (chatsResponse) => {
        chats.value = [];

        for (const chat of chatsResponse.data) {
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

    const getChats = async () => {
        try {
            if (storageToken != null) {
                await axios.post("http://localhost:8080/api/chats/get", {
                    token: storageToken
                })
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
        friends.value = [];

        let updatedFriends = [];
        
        for (const friend of friendsResponse) {
            const avatar = getAvatar(friend.user.username);
            updatedFriends.push({friendAvatar: avatar, friendObj: friend});
        }

        friends.value = updatedFriends;
    }

    const getFriends = async () => {
        try {
            if (storageToken != null) {
                await axios.post("http://localhost:8080/api/friends/get", {
                    token: storageToken
                })
                .then(function(response) {
                    updateFriends(response.data);
                    console.log(friends);
                });
            }
        } catch (error) {
             console.log(error);
        }
    }
    
    const checkToken = async () => {
        try {
            if (storageToken != null) {   
                await axios.post("http://localhost:8080/api/auth/user-info", {
                    token: storageToken
                })
                .then(function(response) {
                    console.log(response);
                    username.value = response.data.username;
                    getFriends();
                    getChats();
                    userAvatar.value = getAvatar(username.value, true);
                });
            } else {
                throw new Error("СУКА, ЕЩЁ РАЗ ПУСТОЙ ТОКЕН ОТПРАВИШЬ, РУКИ ОТОРВУ!");
            }
        } catch (error) {
             console.log('Redirect to: /auth');
             router.push({path: '/auth'});
        }
    }

    checkToken();

    const removeFriend = async (friendUsername) => {
        try {
            if (storageToken != null) {
                await axios.post("http://localhost:8080/api/friends/remove", {
                    token: storageToken,
                    friendUsername: friendUsername
                })
                .then(function(response) {
                    updateFriends(response.data.body);
                    console.log(friends);
                });
            }
        } catch (error) {
             console.log(error);
        }
    }

    const addFriend = (friendName) => {
        axios.post('http://localhost:8080/api/friends/add', {
            token: storageToken,
            friendUsername: friendName
        })
        .then(function (response) {
            updateFriends(response.data.body);
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const acceptFriend = (friendName) => {
        axios.post('http://localhost:8080/api/friends/accept', {
            token: storageToken,
            friendUsername: friendName
        })
        .then(function (response) {
            updateFriends(response.data.body);
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const chat = async (friendUsername) => {
        axios.post('http://localhost:8080/api/chats/create', {
            token: storageToken,
            friendUsername: friendUsername
        })
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

        const socket = new SockJS('http://localhost:8080/ws');
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

    const connectToFriendsRequests = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.value = Webstomp.over(socket);

        stompClient.value.connect({}, () => {
            console.log('WebSocket connected!');
            stompClient.value.subscribe(`/topic/requests/friend/${username.value}`, (message) => {
                getFriends();
                console.log(message);
            });
        });

        return stompClient;
    }

    connectToFriendsRequests();

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

    const deleteMessage = (messageId) => {
        axios.post('http://localhost:8080/api/chat/' + currentChatId.value +'/messages/delete/' + messageId)
        .then(function (response) {
            console.log(response);
        })
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
        <div class="servers-panel">
            <div class="servers-list">
                <button class="server-button" @click="openedFriendsPanel = true">Frnds</button>
                <button class="server-button" @click="openedChatsPanel = (!openedChatsPanel)">Chats</button>
            </div>
            <div class="account-button">
                Acc
                <img :src="userAvatar" alt="Avatar" class="avatar-image" />

                <div class="status">
                    
                </div>
                <div class="account-menu">
                    <PrimaryButton @click="openedAccountPanel = true" text="settings" size="s" color=""/>
                </div>
            </div>
        </div>
        <div class="main-plane">
            <div v-if="openedChatsPanel" id="chats-panel" class="chats-panel">
                <div class="chat" v-for="chat in chats">
                    <button class="chat-button" @click="connectToStompChat(chat.chatInfo.chatId)">
                        <div class="chat-avatar">
                            <img :src="chat.chatAvatar" class="avatar-image" />
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
                            <img :src="message.senderAvatar" class="avatar-image" />
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