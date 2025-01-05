<template>
    <div :class="$style['account-notifications-wrapper']">
            <PhBell :class="$style['account-notifications']" :size="40"/>
            <div :class="$style['notifications-menu']">
            </div>
        </div>
</template>

<script setup>
    import { useApi } from '@/composables/useApi';
    import { PhBell } from '@phosphor-icons/vue';
    import { ref } from 'vue';

    const notifications = ref([])

    const getNotificationsApi = useApi({url: "/api/notifications/get", method: "get"});
    const getNotifications = async () => {
        try {
            getNotificationsApi.execute()
            .then(function(response) {
                notifications.value = response;
            });
        } catch (error) {
            console.log(error);
        }
    }

    getNotifications();
</script>

<style module>
    .account-notifications-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        height: 100%;
        aspect-ratio: 1/1;
        margin: 10px;
    }

    .account-notifications {
        color: #fff;
        transition: all 0.5s ease;
        height: 100%;
    }

    .account-notifications:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);
        cursor: pointer;
    }

    .notifications-menu {
        position: absolute;
        background: transparent;
        width: 0%;
        height: 0px;
        top: 0%;
        border: 2px solid transparent;
        border-radius: 1vh 1vh 1vh 1vh;
        transition: all 0.5s ease;
        z-index: 15;
    }

    .account-notifications-wrapper:hover .notifications-menu {
        height: 200px;
        width: 300%;
        top: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        border-color: #00ffff;
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
    }
</style>