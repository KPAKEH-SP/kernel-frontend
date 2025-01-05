import { createSharedComposable } from "@vueuse/core";
import { ref } from "vue";
import { useSharedUsername } from "./useSharedUsername";
import { useWebstomp } from "./useWebstomp";
import { useApi } from "./useApi";
import { useConvertChat } from "./useConvertChat";

export const useSharedChats = createSharedComposable(() => {
    const { username } = useSharedUsername();
    const currentChat = ref();
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

    const setCurrentChat = (chatId) => {
        currentChat.value = chats.value.find(chat => chat.chatInfo.chatId === chatId);
    }

    return { chats, currentChat, setCurrentChat };
});