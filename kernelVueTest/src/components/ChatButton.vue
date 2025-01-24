<template>
    <div :class="$style.wrapper">
        <BaseWidget :class="$style.widget">
            <div :class="$style['button-content']" v-if="chatInfo.type == 'personal'">
                <UserAvatar :class="$style.avatar" :username="chatInfo.chatInfo.companion"/>
                {{ chatInfo.chatInfo.companion }}
            </div>
            <div v-if="chatInfo.type == 'group'" :class="$style['button-content']">
                <div :class="$style['group-avatar']">
                    <UserAvatar :class="$style.avatar" :username="chatInfo.chatInfo.users[0].username"/>
                    <UserAvatar :class="$style['avatar-second']" :username="chatInfo.chatInfo.users[1].username"/>
                </div>
                {{ chatInfo.chatInfo.chatName }}
            </div>
        </BaseWidget>
    </div>
</template>

<script setup>
    import BaseWidget from './ui/BaseWidget.vue';
    import UserAvatar from './ui/UserAvatar.vue';

    const chatInfo = defineModel('chatInfo', {type: Object});
</script>

<style module>
    .wrapper {
        width: 100%;
        height: max-content;
    }

    .widget {
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px 30px 0px 0px;
        gap: 10px;

        border-radius: 80px 30px 30px 80px;

        transition: all ease 0.5s;
    }

    .widget:hover {
        border-color: #00ffff;
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        color: #00ffff;

        cursor: pointer;
    }

    .avatar {
        height: 70px;
        width: 70px;
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

    .button-content {
        display: flex;
        flex-direction: row;
        gap: 10px;

        align-items: center;

        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;

        color: #FFFFFF;
    }
</style>