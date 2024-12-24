<script setup>
    import { ref } from 'vue';
    import PrimaryButton from './ui/PrimaryButton.vue';
    import FriendCard from './ui/FriendCard.vue';
    import { PhChatCircleDots, PhCheck, PhSpinnerGap, PhTrash, PhUserPlus, PhX } from '@phosphor-icons/vue';
    
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
            <PhUserPlus class="add-friend" :size="30" @click="emit('addFriend', friendName)"/>
        </input>
    </div>

    <div class="pages">
        <PrimaryButton @click="openedFriendsList = true, openedRequestsList = false" text="friends" size="" color="" :class="{'active-page': openedFriendsList === true}"/>
        <PrimaryButton @click="openedRequestsList = true, openedFriendsList = false" text="requests" size="" color="" :class="{'active-page': openedRequestsList ===true}"/>    
    </div>

    <div v-if="openedFriendsList" class="list">
        <div v-for="friend in friends" :key="friend.id">
            <FriendCard v-if="friend.friendObj.status == 'ACCEPTED'" :username="friend.friendObj.user.username">
                <PhChatCircleDots class="blue-icon" :size="30" @click="emit('openChat', friend.friendObj.user.username)"/>
                <PhTrash class="red-icon" :size="30" @click="emit('removeFriend', friend.friendObj.user.username)"/>
            </FriendCard>
        </div>
    </div>

    <div v-if="openedRequestsList" class="list">
        <div v-for="friend in friends" :key="friend.id">

            <FriendCard v-if="friend.friendObj.status == 'PENDING'" :username="friend.friendObj.user.username">
                <PhCheck v-if="friend.friendObj.pendingFrom.username != username" @click="emit('accept', friend.friendObj.user.username)" class="blue-icon" :size="30"/>
                <PhSpinnerGap class="loading" v-else/>
                <PhX @click="emit('removeFriend', friend.user.username)" class="red-icon" :size="30"/>
            </FriendCard>
        </div>
    </div>
</template>

<style scoped>
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