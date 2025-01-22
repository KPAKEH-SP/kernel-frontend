<template>
    <BaseWidget :class="$style.widget">
        <div :class="$style.wrapper">
            <UserAvatar 
            :username="userDataState.username"
            :class="$style.avatar"/>
            <div :class="$style.data">
                <div :class="$style.sender">
                    {{ message.data.sender }}
                </div>

                <div :class="$style.content">
                    {{ message.data.content }}
                </div>

                <div :class="$style.timestamp">
                    {{ message.data.timestamp }}
                </div>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
    import { useUserData } from '@/composables/useUserData';
    import UserAvatar from './ui/UserAvatar.vue';
    import BaseWidget from './ui/BaseWidget.vue';

    const message = defineModel('message', {type: Object});
    const { state:userDataState } = useUserData();
</script>

<style module>
    .widget {
        height: max-content;
    }

    .wrapper {
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 30px;
        gap: 10px;

        width: 100%;
    }

    .avatar {
        width: 50px;
        height: 50px;
    }

    .data {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0px;
        gap: 10px;

        width: 100%;
        height: 100%;
    }

    .sender {
        width: 100%;

        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: flex-end;
        text-align: center;

        color: #FFFFFF;
    }

    .content {
        width: 100%;

        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;

        color: #FFFFFF;
    }

    .timestamp {
        width: 100%;

        font-family: 'Cairo';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        text-align: center;

        color: #FFFFFF;
    }
</style>