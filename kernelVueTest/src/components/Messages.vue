<template>
    <div :class="$style.wrapper">
        <Message v-for="(message, index) in messages" :key="index" :class="$style.message" v-model:message="messages[index]"/>
    </div>
</template>

<script setup>
    import { useApi } from '@/composables/useApi';
    import PrimaryButton from './ui/PrimaryButton.vue';
    import { useUserData } from '@/composables/useUserData';
    import Message from './Message.vue';

    const messages = defineModel('messages', {type: Array});
    const { state:userDataState } = useUserData();
    const props = defineProps({chatId: {required: true}})

    const deleteMessageApi = useApi({url: "api/messages/delete", method: "post"})
    const deleteMessage = (messageId) => {
        deleteMessageApi.execute(0, {data: {chatId: props.chatId, messageId: messageId}})
        .catch(function (error) {
            console.log(error);
        });
    }
</script>

<style module>
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px;
        gap: 10px;

        width: 100%;
        height: 100%;
        
        overflow-y: scroll;
        scrollbar-width: none;
    }

    .wrapper::-webkit-scrollbar {
        display: none;
    }
</style>