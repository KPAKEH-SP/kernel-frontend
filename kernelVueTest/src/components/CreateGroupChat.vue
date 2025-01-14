<template>
    <div :class="$style.root">
        <div :class="$style.header">
            <input :class="$style['chat-name']" placeholder="chat name" v-model="chatName">
            <div @click="createChat()" :class="$style['card-button']">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6562 23.74C15.9965 22.8477 17.014 21.5479 17.5584 20.0326C18.1027 18.5173 18.145 16.867 17.6789 15.3259C17.2128 13.7847 16.2631 12.4345 14.9703 11.4748C13.6774 10.5151 12.1101 9.99696 10.5 9.99696C8.8899 9.99696 7.32255 10.5151 6.02971 11.4748C4.73688 12.4345 3.7872 13.7847 3.32111 15.3259C2.85503 16.867 2.89728 18.5173 3.44162 20.0326C3.98596 21.5479 5.0035 22.8477 6.34375 23.74C3.91936 24.6335 1.84888 26.287 0.441249 28.4538C0.367269 28.5637 0.315882 28.6873 0.290076 28.8173C0.264269 28.9472 0.264558 29.0811 0.290926 29.2109C0.317293 29.3408 0.369213 29.4642 0.443667 29.5738C0.518122 29.6834 0.613626 29.7772 0.724627 29.8496C0.835629 29.922 0.959914 29.9716 1.09026 29.9955C1.2206 30.0195 1.35441 30.0173 1.48389 29.989C1.61338 29.9608 1.73596 29.9071 1.84452 29.8311C1.95308 29.7551 2.04545 29.6583 2.11625 29.5462C3.02424 28.1497 4.2667 27.0021 5.7308 26.2077C7.1949 25.4133 8.83425 24.9972 10.5 24.9972C12.1657 24.9972 13.8051 25.4133 15.2692 26.2077C16.7333 27.0021 17.9758 28.1497 18.8838 29.5462C19.0304 29.7642 19.257 29.9158 19.5145 29.968C19.772 30.0203 20.0397 29.9691 20.2597 29.8256C20.4798 29.6821 20.6345 29.4577 20.6905 29.201C20.7464 28.9443 20.6991 28.6758 20.5588 28.4538C19.1511 26.287 17.0806 24.6335 14.6562 23.74ZM5 17.5C5 16.4122 5.32257 15.3488 5.92692 14.4444C6.53126 13.5399 7.39025 12.8349 8.39524 12.4187C9.40023 12.0024 10.5061 11.8935 11.573 12.1057C12.6399 12.3179 13.6199 12.8417 14.3891 13.6109C15.1583 14.3801 15.6821 15.3601 15.8943 16.427C16.1065 17.4939 15.9976 18.5998 15.5813 19.6048C15.1651 20.6098 14.4601 21.4687 13.5556 22.0731C12.6512 22.6774 11.5878 23 10.5 23C9.04182 22.9983 7.64383 22.4184 6.61274 21.3873C5.58165 20.3562 5.00165 18.9582 5 17.5ZM31.2675 29.8375C31.0454 29.9823 30.7748 30.033 30.5153 29.9784C30.2558 29.9238 30.0286 29.7683 29.8838 29.5462C28.9769 28.1489 27.7346 27.0008 26.2702 26.2067C24.8058 25.4126 23.1658 24.9978 21.5 25C21.2348 25 20.9804 24.8946 20.7929 24.7071C20.6054 24.5196 20.5 24.2652 20.5 24C20.5 23.7348 20.6054 23.4804 20.7929 23.2929C20.9804 23.1054 21.2348 23 21.5 23C22.31 22.9992 23.1098 22.8196 23.8422 22.4739C24.5747 22.1282 25.2218 21.625 25.7373 21.0002C26.2527 20.3754 26.6238 19.6445 26.8241 18.8597C27.0243 18.0749 27.0488 17.2555 26.8956 16.4602C26.7425 15.6648 26.4156 14.9131 25.9383 14.2587C25.4609 13.6044 24.845 13.0635 24.1344 12.6748C23.4238 12.2861 22.6361 12.0591 21.8276 12.0101C21.0192 11.9611 20.2098 12.0912 19.4575 12.3912C19.3348 12.4443 19.2028 12.4722 19.0691 12.4733C18.9355 12.4744 18.803 12.4488 18.6795 12.3978C18.5559 12.3469 18.4438 12.2717 18.3498 12.1767C18.2559 12.0817 18.1819 11.9688 18.1322 11.8447C18.0826 11.7207 18.0583 11.5879 18.0609 11.4543C18.0634 11.3207 18.0927 11.1889 18.1471 11.0668C18.2014 10.9447 18.2796 10.8347 18.3772 10.7434C18.4747 10.6521 18.5896 10.5812 18.715 10.535C20.4368 9.84831 22.352 9.8236 24.0909 10.4656C25.8299 11.1077 27.2695 12.3709 28.132 14.0118C28.9945 15.6526 29.2188 17.5547 28.7616 19.3511C28.3044 21.1476 27.1982 22.7111 25.6562 23.74C28.0806 24.6335 30.1511 26.287 31.5588 28.4538C31.7036 28.6759 31.7543 28.9464 31.6997 29.2059C31.645 29.4654 31.4896 29.6926 31.2675 29.8375Z"/>
                    <path d="M34 37V27M29 32H39" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
        </div>

        <div :class="$style['friends-list']">
            <div v-for="friend in friends">
                <FriendCard :username="friend.username">
                    <PhPlus v-if="!chatMembers.has(friend.username)" @click="addUser(friend.username)" :class="$style['card-button']" :size="30"/>
                    <PhMinus v-else @click="deleteUser(friend.username)" :class="$style['card-button']" :size="30"/>
                </FriendCard>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useApi } from '@/composables/useApi';
    import { useConvertFriendResponse } from '@/composables/useConvertFriendResponse';
    import { onMounted, ref } from 'vue';
    import FriendCard from './ui/FriendCard.vue';
    import { PhMinus, PhPlus } from '@phosphor-icons/vue';

    const friends = ref([]);
    const chatMembers = ref(new Set);
    const chatName = ref('');

    onMounted(() => {
        const getFriendsApi = useApi({url: "api/friends/get", method: "get"});
        getFriendsApi.execute()
            .then(function(response) {
                friends.value = useConvertFriendResponse(response);
            }).catch(function(error) {
                console.log(error);
            });
    });

    const addUser = (username) => {
        chatMembers.value.add(username);
    }

    const deleteUser = (username) => {
        chatMembers.value.delete(username);
    }

    const createGroupChatApi = useApi({url: "/api/chats/create/group", method: "post"});
    const createChat = () => {
        if (chatMembers.value.size < 2) {
            console.error("There must be more than 2 people in a group chat")
            return;
        }

        let members = [];
        chatMembers.value.forEach((member) => {
            members.push(member);
        })
        createGroupChatApi.execute(0, {data: {membersUsernames: members, chatName: chatName.value}})
        .catch((error) => {
            console.log(error);
        })
    }
</script>

<style module>
    .root {
        display: flex;
        flex-direction: column;
        justify-content: center;
        
        width: 50vw;
        height: 50vh;

    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        border: solid #fff 1px;
        border-radius: 10vh;

        padding: 10px;
        margin-bottom: 5px;

    }

    .friends-list {
        display: flex;
        flex-direction: row;
        
        border: solid #fff 1px;
        border-radius: 3vh;

        margin-top: 5px;

        overflow-y: auto;
        scrollbar-width: none;
    }

    .card-button {
        color: #fff;
        transition: all 0.5s ease;
    }

    .card-button:hover {
        color: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);

        cursor: pointer;
    }

    .card-button svg {
        fill: #fff;
        stroke: #fff;
        transition: all 0.5s ease;
    }

    .card-button:hover svg {
        fill: #00ffff;
        stroke: #00ffff;
        filter: drop-shadow(0 0 5px #00ffff);

        cursor: pointer;
    }

    .chat-name {
        font-family: "Roboto Mono", monospace;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: var(--font-size);
        line-height: var(--font-size);

        background: transparent;
        color: #ffffff;
        border-color: solid #ffffff;

        border: none;
        border-bottom: solid #ffffff;
        min-height: 3vh;
        max-width: 10vw;
        min-width: 10vw;

        outline: none;
        text-align: center;

        transition: 0.3s ease;
    }

    .chat-name:hover, .chat-name:focus{
        box-shadow: #00ffff 0 0 7px, inset #00ffff 0 0 7px;
        border-radius: 10vh;
        border-color: #00ffff;
        border-top: solid;
        border-left: solid;
        border-right: solid;
        border-bottom: solid;
        color: #00ffff;
    }
</style>