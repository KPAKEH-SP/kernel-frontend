<template>
    <div :class="$style['up-menu']">
        <PhChatsCircle @click="chatsPanelIsOpened = (!chatsPanelIsOpened)" :class="$style['up-item']" :size="40"/>
        <PhUsers @click="friendsPanelIsOpened = true" :class="$style['up-item']" :size="40"/>
        <NotificationsButton/>
        <div :class="$style['account-button']">
            <div :class="$style['avatar-wrapper']">
                <img :src="getAvatar(username, true)" onerror="this.style.display='none';" class="avatar-image"/>
            </div>

            <div :class="$style.status"></div>
            
            <div :class="$style['account-menu']">
                <PhGear :class="$style['account-settings']" @click="accountPnaelIsOpened = true" :size="30"/>
            </div>
        </div>
        <div :class="$style['open-up-menu']">
            <PhCaretLineDown :size="30"/>
        </div>
    </div>
</template>

<script setup>
    import { useSharedUsername } from '@/composables/useSharedUsername';
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';
    import { PhCaretLineDown, PhChatsCircle, PhGear, PhUsers } from '@phosphor-icons/vue';
    import NotificationsButton from './NotificationsButton.vue';

    const chatsPanelIsOpened = defineModel('openedChatsPanel', {type: Boolean, default: false});
    const friendsPanelIsOpened = defineModel('openedFriendsPanel', {type: Boolean, default:false});
    const accountPnaelIsOpened = defineModel('openedAccountPanel', {type: Boolean, default: false});

    const { username } = useSharedUsername();
</script>

<style module>
    .up-menu {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        border: 0px solid #fff;
        height: 0px;
        transition: all 0.5s ease;
        box-sizing: border-box;
    }

    .up-menu:hover {
        border: 3px solid #fff;
        height: 5vh;
    }

    .up-menu:hover .account-button {
        border: 2px solid #ffffff;
    }

    .open-up-menu:hover + .up-menu {
        border: 3px solid #fff;
        height: 5vw;
    }

    .open-up-menu {
        display: flex;
        justify-content: center;
        position: absolute;
        top: 100%;
        width: 100%;
        z-index: 1;
    }

    .account-settings:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);
        cursor: pointer;
    }

    .account-button:hover .account-menu{
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border: 2px solid  #00ffff;
        color: #00ffff;
        height: 100px;
        overflow: visible;
    }

    .account-button {
        position: relative;
        display: flex;
        height: 100%;
        aspect-ratio: 1/1;
        background: #000;
        border: 0px solid #ffffff;
        border-radius: 50%;
        color: #ffffff;
        align-items: center;
        justify-content: center;
        margin-top: 5px;
        margin-bottom: 5px;
        transition: all 0.5s ease;
        box-sizing: border-box;
        margin: 10px;
    }

    .account-settings {
        color: #fff;
        transition: all 0.5s ease;
    }


    .status {
        height: 10px;
        width: 10px;
        background-color: #43ff43;
        border-radius: 50%;
        position: absolute;
        bottom: 1px;
        z-index: 20;
        left: 1px;
    }

    .account-menu {
        display: flex;
        flex-direction: column;
        position: absolute;
        background-color: #000;
        border: 0px solid #fff;
        border-radius: 0vh 0vh 1vh 1vh;
        transition: all 0.5s ease;
        top: 50%;
        height: 0px;
        width: 100%;
        align-items: center;
        justify-content: end;
        overflow: hidden;
        z-index: 10;
    }

    .avatar-wrapper {
        background: #000;
        width: 100%;
        height: 100%;
        z-index: 15;
        border-radius: 50%;
    }

    .up-item {
        transition: all 0.5s ease;
        margin: 10px;
        height: 0px;
        height: 100%;
    }

    .up-item:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);
        cursor: pointer;
    }

    .server-button:hover, .account-button:hover {
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-color: #00ffff;
        color: #00ffff;
    }
</style>