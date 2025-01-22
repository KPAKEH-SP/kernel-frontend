<template>
    <div :class="$style.wrapper">
        <Message v-for="(message, index) in messages" :key="index" :class="$style.message" v-model:message="messages[index]"/>
    </div>

    <!--div :class="$style.messages">
        <div v-for="(message, index) in messages" :key="index" :class="$style.message">
            <div :class="$style['user-avatar']">
                <img :src="message.senderAvatar" :class="$style['avatar-image']" onerror="this.style.display='none';"/>
            </div>
            <div :class="$style['message-info']">
                <div :class="$style['author-info']">
                    {{ message.data.sender }}
                </div>
                <div>
                    {{ message.data.content }}
                </div>
                <div :class="$style.timestamp">
                    {{ message.data.timestamp }}
                </div>
            </div>
            <div :class="$style['message-control']">
                <div v-if="message.data.sender == userDataState.username">
                    <PrimaryButton @click="deleteMessage(message.data.messageId)" text="del" size="" color="red"/>
                </div>
            </div>
        </div>
    </div-->
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
    }

    .wrapper::-webkit-scrollbar {
        display: none;
    }

    /*.messages {
        display: flex;
        flex-direction: column;

    }



    .message {
        display: flex;
        border: solid #fff;
        border-radius: 2vh;
        margin: 1%;
        padding: 1%;
    }

    .author-info {
        color: #959595;
    }

    .user-avatar {
        height: 50px;
        width: 50px;
        border: solid #fff 1px;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        position: relative;
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    .avatar-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .message-info {
        flex-grow: 1;
        margin-left: 1%;
    }

    .timestamp {
        color: #555555;
    }

    .message-control {
        display: flex;
        align-items: center;
    }*/
</style>