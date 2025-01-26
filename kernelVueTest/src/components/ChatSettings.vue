<template>
    <BaseWidget :class="$style['chat-settings']">
        <UserAvatar v-if="currentChat.type == 'personal'" 
        :class="$style.avatar" 
        :username="currentChat.chatInfo.companion"/>

        <div v-if="currentChat.type == 'group'" :class="$style['group-avatar']">
            <UserAvatar :class="$style.avatar" 
            :username="currentChat.chatInfo.users[0].username"/>
            <UserAvatar :class="$style['avatar-second']" 
            :username="currentChat.chatInfo.users[1].username"/>
        </div>
        
        <div v-if="currentChat.type == 'personal'" :class="$style['chat-name']">
            {{ currentChat.chatInfo.companion }}
        </div>

        <div v-if="currentChat.type == 'group'" :class="$style['chat-name']">
            {{ currentChat.chatInfo.chatName }}    
        </div>
    </BaseWidget>
</template>

<script setup>
    import { useSharedChats } from '@/composables/useSharedChats';
    import BaseWidget from './ui/BaseWidget.vue';
    import UserAvatar from './ui/UserAvatar.vue';
    
    const { currentChat } = useSharedChats();
</script>

<style module>
    .chat-settings {
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32px;
        gap: 10px;

        width: 15%;
        height: 100%;
    }

    .avatar-second {
        height: 70px;
        width: 70px;

        margin-left: -42px;
    }

    .group-avatar {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;

        width: max-content;
        height: 70px;
    }

    .avatar {
        height: 70px;
        width: 70px;
    }

    .chat-name {
        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;
        text-align: center;

        color: #FFFFFF;
    }
</style>