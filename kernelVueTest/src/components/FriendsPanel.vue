<script setup>
    import { ref } from 'vue';
    import PrimaryButton from './ui/PrimaryButton.vue';
    import axios, { AxiosError } from 'axios';
    import FriendCard from './ui/FriendCard.vue';
    
    const props = defineProps({
        username:{type:String, required:true}
    });
    
    const friends = defineModel('friends', { type: Array, default: false });

    const emit = defineEmits(["addFriend", "openChat", "removeFriend", "accept"]);
    const friendName = ref('');
    const openedFriendsList = ref(true);
    const openedRequestsList = ref(false);
</script>

<template>
    <div class="input-panel">
        <input v-model="friendName" type="text" name="username" placeholder="friend username" autocomplete="off">
        <PrimaryButton @click="emit('addFriend', friendName)" text='add to friend' size="" color=""/>
    </div>

    <div class="pages">
        <PrimaryButton @click="openedFriendsList = true, openedRequestsList = false" text="friends" size="" color=""/>
        <PrimaryButton @click="openedRequestsList = true, openedFriendsList = false" text="requests" size="" color=""/>    
    </div>

    <div v-if="openedFriendsList" class="list">
        <div v-for="friend in friends" :key="friend.id">
            <FriendCard v-if="friend.friendObj.status == 'ACCEPTED'" :username="friend.friendObj.user.username">
                <PrimaryButton @click="emit('openChat', friend.friendObj.user.username)" text='chat' size="" color=""/>
                <PrimaryButton @click="emit('removeFriend', friend.friendObj.user.username)" text="remove" size="" color="red"/>    
            </FriendCard>
        </div>
    </div>

    <div v-if="openedRequestsList" class="list">
        <div v-for="friend in friends" :key="friend.id">

            <FriendCard v-if="friend.friendObj.status == 'PENDING'" :username="friend.friendObj.user.username">
                <PrimaryButton v-if="friend.friendObj.pendingFrom.username != username" @click="emit('accept', friend.friendObj.user.username)" text='accept' size="" color=""/>
                <div v-else>
                    sended
                </div>
                <PrimaryButton v-if="friend.friendObj.pendingFrom.username != username" @click="emit('removeFriend', friend.user.username)" text="dismiss" size="" color="red"/>
                <PrimaryButton v-else @click="emit('removeFriend', friend.friendObj.user.username)" text="cancel" size="" color="red"/>
            </FriendCard>
        </div>
    </div>
</template>

<style>
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
    }

    .friends-list::-webkit-scrollbar {
        display: none;
    }

    .friend {
        display: flex;
        align-items: center;
        padding: 10px;
        margin-bottom: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        justify-content: center;
    }

    .friend-avatar {
        height: 50px;
        width: 50px;
        border: solid #fff 1px;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        position: relative;
        display: flex;
        align-items: center;
    }

    .friend-name {
        text-align: left;
        width: 75%;
        font-size: 18px;
        margin-left: 10px;
    }

    .friend-button {
        width: 15%;
        background: transparent;
        color: #ffffff;
        border-color: solid #ffffff;
        border-radius: 0px;
        border: none;
        border-bottom: solid #ffffff;
        outline: none;
        text-align: center;
        transition: 0.3s ease;
    }

    .friend-button:hover {
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-radius: 10vh;
        border-color: #00ffff;
        border-top: solid;
        border-left: solid;
        border-right: solid;
        border-bottom: solid;
        color: #00ffff;
    }

    .friend .friend-button.-rem:hover {
        box-shadow: #ff4343 0 0 7px, inset #ff4343 0 0 7px;
        border-radius: 10vh;
        border-color: #ff4343;
        border-top: solid;
        border-left: solid;
        border-right: solid;
        border-bottom: solid;
        color: #ff4343;
    }

    .pages {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>