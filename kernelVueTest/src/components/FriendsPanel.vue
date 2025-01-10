<template>
    <div :class="$style['input-panel']">
        <input v-model="addedFriendName" type="text" name="username" placeholder="friend username" autocomplete="off">
            <PhUserPlus :class="$style['add-friend']" :size="30" @click="addFriend()"/>
        </input>
    </div>

    <div :class="$style.pages">
        <PrimaryButton @click="openedFriendsList = true, openedRequestsList = false" 
        text="friends" 
        size="" 
        color="" 
        :class="{[$style['active-page']]: openedFriendsList === true}"/>
        <PrimaryButton @click="openedRequestsList = true, openedFriendsList = false" 
        text="requests" 
        size="" 
        color="" 
        :class="{[$style['active-page']]: openedRequestsList === true}"/>    
    </div>

    <div v-if="openedFriendsList" :class="$style.list">
        <div v-for="friend in friends" :key="friend.id">
            <FriendCard v-if="friend.status == 'ACCEPTED'" :username="friend.username">
                <PhChatCircleDots :class="$style['blue-icon']" @click="createChat(friend.username)" :size="30"/>
                <PhTrash :class="$style['red-icon']" :size="30" @click="removeFriend(friend.username)"/>
            </FriendCard>
        </div>
    </div>

    <div v-if="openedRequestsList" :class="$style.list">
        <div v-for="friend in friends" :key="friend.id">
            <FriendCard v-if="friend.status == 'PENDING'" :username="friend.username">
                <PhCheck v-if="friend.pendingFrom != userDataState.username" @click="acceptFriend(friend.username)" :class="$style['blue-icon']" :size="30"/>
                <PhSpinnerGap :class="$style.loading" v-else/>
                <PhX @click="removeFriend(friend.username)" :class="$style['red-icon']" :size="30"/>
            </FriendCard>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import PrimaryButton from './ui/PrimaryButton.vue';
    import FriendCard from './ui/FriendCard.vue';
    import { PhChatCircleDots, PhCheck, PhSpinnerGap, PhTrash, PhUserPlus, PhX } from '@phosphor-icons/vue';
    import { useUserData } from '@/composables/useUserData';
    import { useFriendApi } from '@/composables/useFriendApi';
    import { useConvertFriendResponse } from '@/composables/useConvertFriendResponse';
    import { useApi } from '@/composables/useApi';
    import { useWebstomp } from '@/composables/useWebstomp';

    const { state:userDataState } = useUserData();
    const friends = ref([]);
    const addedFriendName = ref('');
    const openedFriendsList = ref(true);
    const openedRequestsList = ref(false);

    onMounted(() => {
        const getFriendsApi = useApi({url: "api/friends/get", method: "get"});
        getFriendsApi.execute()
            .then(function(response) {
                friends.value = useConvertFriendResponse(response);
            }).catch(function(error) {
                console.log(error);
            });

        const friendsWebSocket = useWebstomp(`/topic/requests/friend/${userDataState.value.username}`);
            friendsWebSocket.emitter.on('wsMessage', (message) =>  {
            const jsonMessage = JSON.parse(message.body);
            friends.value = useConvertFriendResponse(jsonMessage);
        });
    });

    const addFriend = () => {
        friends.value = useFriendApi('add', addedFriendName.value);
    }

    const removeFriend = (friendName) => {
        friends.value = useFriendApi('remove', friendName);
    }

    const acceptFriend = (friendName) => {
        friends.value = useFriendApi('accept', friendName);
    }

    const chatApi = useApi({url: "/api/chats/create", method: "post"});
    const createChat = (friendName) => {
        chatApi.execute(0, {data: {username: friendName}})
        .catch(function (error) {
            if (error.status == 409) {
                console.log("Chat is already created")
            }
        });
    }
</script>

<style module>
    .active-page {
        color: #00ffff;
        text-shadow: #00ffff 0 0 6px;
    }

    .list {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 2vh;
        box-sizing: border-box;
        scrollbar-width: none;
        flex-grow: 1;
        flex-wrap: wrap;
    }

    .pages {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .blue-icon, .red-icon {
      color: #fff;
      transition: all 0.5s ease;
    }

    .blue-icon:hover, .add-friend:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);
        cursor: pointer;
    }

    .red-icon:hover {
        color: #ff4343;
        filter: drop-shadow(0 0 5px #ff4343);
        cursor: pointer;
    }

    .input-panel {
        display: flex;
        flex-direction: row;
        gap: 1vw;
        justify-content: center;
        align-items: center;
    }

    .input-panel input {
        font-family: "Roboto Mono", monospace;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: var(--font-size);
        line-height: var(--font-size);

        background: transparent;
        color: #ffffff;
        border-color: solid #ffffff;

        border: none;
        border-bottom: solid #ffffff;
        min-height: 3vh;
        max-width: 10vw;
        min-width: 10vw;

        outline: none;
        text-align: center;

        transition: 0.3s ease;
    }

    .input-panel input:hover, input:focus{
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-radius: 10vh;
        border-color: #00ffff;
        border-top: solid;
        border-left: solid;
        border-right: solid;
        border-bottom: solid;
        color: #00ffff;
    }

    .add-friend {
        position: absolute;
        left: 59%;
        color: #fff;
        transition: all 0.5s ease;
    }

    .loading {
        animation: spin 3s linear infinite;
    }

    @keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>