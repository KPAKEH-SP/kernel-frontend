import { createSharedComposable } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useApi } from "./useApi";
import { useSharedUsername } from "./useSharedUsername";
import { getAvatar } from "@/utils/users/avatars/GetAvatars";

export const useSharedChats = createSharedComposable((update = false) => {
    const { username } = useSharedUsername();
    let chats = ref([]);

    onMounted(() => {
        updateChats();
    });

    const updateChats = () => {
        const getChatsApi = useApi({url: "/api/chats/get", method: "get"});
        getChatsApi.execute()
        .then((response) => {
            chats.value = [];
            for (const chat of response) {
                if (chat.users.length == 2) {
                    for (const user of chat.users) {
                        if (user.username != username.value) {
                            const avatar = getAvatar(user.username);
                            chats.value.push({ chatAvatar: avatar, chatName: user.username, chatInfo: chat });
                        }
                    }
                }
            }
            console.log("CHATS LIST UPDATED >>> ", chats.value);
        }).catch((error) => {
            console.log(error)
        });
    }

    if (update) {
        updateChats();
    }

    return { chats };
});