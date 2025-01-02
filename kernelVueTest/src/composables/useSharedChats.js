import { createSharedComposable } from "@vueuse/core";
import { ref } from "vue";
import { useSharedUsername } from "./useSharedUsername";
import { getAvatar } from "@/utils/users/avatars/GetAvatars";
import { useWebstomp } from "./useWebstomp";
import { useApi } from "./useApi";
import { useConvertChat } from "./useConvertChat";

export const useSharedChats = createSharedComposable(() => {
    const { username } = useSharedUsername();
    let chats = ref([]);

    const getChatsApi = useApi({url: "/api/chats/get", method: "get"});
    getChatsApi.execute()
    .then((response) => {
        chats.value = [];
        for (const chat of response) {
            chats.value.push(useConvertChat(chat));
        }
    })
    .catch((error) => {
        console.log(error);
    });

    const chatsWebStomp = useWebstomp(`/topic/user/chats/${username.value}`);
    chatsWebStomp.emitter.on('wsMessage', (message) =>  {
        const jsonMessage = JSON.parse(message.body);
        chats.value.push(useConvertChat(jsonMessage));
    });

    return { chats };
});