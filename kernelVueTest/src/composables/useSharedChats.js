import { createSharedComposable } from "@vueuse/core";
import { ref } from "vue";
import { useSharedUsername } from "./useSharedUsername";
import { getAvatar } from "@/utils/users/avatars/GetAvatars";
import { useWebstomp } from "./useWebstomp";
import { useApi } from "./useApi";

export const useSharedChats = createSharedComposable(() => {
    const { username } = useSharedUsername();
    let chats = ref([]);

    const convert = (response) => {
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
    }

    const getChatsApi = useApi({url: "/api/chats/get", method: "get"});
    getChatsApi.execute()
    .then((response) => {
        convert(response);
    })
    .catch((error) => {
        console.log(error);
    });

    const chatsWebStomp = useWebstomp(`/topic/user/chats/${username.value}`);
    chatsWebStomp.emitter.on('wsMessage', (message) =>  {
        const jsonMessage = JSON.parse(message.body);
        convert(jsonMessage);
    });


    return { chats };
});