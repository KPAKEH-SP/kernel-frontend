<script setup>
    import { ref } from 'vue';
    import PrimaryButton from './ui/PrimaryButton.vue';
    
    const props = defineProps({
        friends:{type:Array, required:true}
    });
    
    const emit = defineEmits();
    const friendName = ref('');
</script>

<template>
    <div class="input-panel">
        <input v-model="friendName" type="text" name="username" placeholder="friend username" autocomplete="off">
        <PrimaryButton @click="emit('addFriend', friendName)" text='add to friend' size="" color=""/>
    </div>

    <div class="friends-list">
        <div v-for="friend in props.friends" :key="friend.id" class="friend">
            <div class="friend-avatar">A</div>
            <div class="friend-name">{{ friend.username }}</div>
            <PrimaryButton @click="emit('openChat', friend.username)" text='chat' size="" color=""/>
            <PrimaryButton @click="emit('removeFriend', friend.username)" text="remove" size="" color="red"/>
        </div>
    </div>
</template>

<style>
    .friends-list {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 2vh;
        padding: 10px;
        box-sizing: border-box;
        scrollbar-width: none;
        height: 87%;
    }

    .friends-list::-webkit-scrollbar {
        display: none; /* Для Chrome, Safari */
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
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 10%;
        border: #ff4343 solid 2px;
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
</style>