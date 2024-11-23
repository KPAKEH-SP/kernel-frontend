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
    
    const storageToken = localStorage.getItem('token');
    const username = ref('');
    const friends = ref([]);
    const chats = ref([]);
    const messages = ref([]);
    const newMessage = ref('');
    let stompClient = null;
    const currentChatId = ref();

    const openedAccountPanel = ref(false);
    const openedFriendsPanel =  ref(false);
    
    
    const updateChats = (chatsResponse) => {
        chatsResponse.data.forEach(chat => {
            if (chat.users.length == 2){
                chat.users.forEach(user => {
                    if (user.username != username.value){
                        chats.value.push({chatName: user.username, chatInfo: chat})
                    }
                });
            }
        });

        console.log('Chats list formed: ');
        console.log(chats);
    }

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

    const getFriends = async () => {
        try {
            if (storageToken != null) {
                await axios.post("http://localhost:8080/api/friends/get", {
                    token: storageToken
                })
                .then(function(response) {
                    friends.value = response.data;
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

    const blur = ref(false);

    const showElement = (elementId) => {
        document.getElementById(elementId).style.display = "flex";
    }

    const removeFriend = async (friendUsername) => {
        try {
            if (storageToken != null) {
                await axios.post("http://localhost:8080/api/friends/remove", {
                    friendUsername: friendUsername,
                    userToken: storageToken
                })
                .then(function(response) {
                    friends.value = response.data.body;
                    console.log(friends);
                });
            }
        } catch (error) {
             console.log(error);
        }
    }

    const chat = async (friendUsername) => {
        axios.post('http://localhost:8080/api/chats/create', {
            token: storageToken,
            friendUsername: friendUsername
        })
        .then(function (response) {
            updateChats(response);
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const connectToStompChat = (chatId) => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Webstomp.over(socket);

        currentChatId.value = chatId;

        stompClient.connect({}, () => {
            console.log('Connected to WebSocket');

            stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            messages.value.push(receivedMessage);
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
        });
    };

    const sendMessage = () => {
        if (newMessage.value.trim() && stompClient && stompClient.connected) {
            let chatId = currentChatId.value;

            const payload = {
                sender: username.value, // Replace with dynamic sender info if needed
                content: newMessage.value, chatId
            };
            stompClient.send(`/app/chat/${chatId}`, JSON.stringify(payload));
            newMessage.value = ''; // Clear the input field
        }
    };

    const addFriend = (friendName) => {
        axios.post('http://localhost:8080/api/friends/add', {
                        token: storageToken,
                        friendName: friendName
                    })
                    .then(function (response) {
                        friends.value = response.data.body;
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
    }
</script>

<template>
    <Modal v-model:open="openedAccountPanel">
        <AccountPanel :username="username"/>
    </Modal>

    <Modal v-model:open="openedFriendsPanel">
        <FriendsPanel :friends="friends" @openChat="chat" @removeFriend="removeFriend" @addFriend="addFriend"/>
    </Modal>

    <div class="main-container">
        <div class="servers-panel">
            <button @click="openedAccountPanel = true">Acc</button>
            <button @click="openedFriendsPanel = true">Frnds</button>
            <button @click="showElement('chats-panel')">Chats</button>
        </div>
        <div class="main-plane">
            <div id="chats-panel" class="chats-panel">
                <div v-for="chat in chats">
                    <PrimaryButton @click="connectToStompChat(chat.chatInfo.chatId)" :text='chat.chatName' size="" color=""/>
                </div>
            </div>
            <div class="chat-window">
                <div class="chat-settings">

                </div>
                <div class="messages"></div>
                <div class="message-panel">
                    <input v-model="newMessage" class="message-input" type="text" placeholder="enter message">
                    <button @click="sendMessage()" class="message-button">Send</button>
                </div>
            </div>
        </div>
    </div>

</template>