import { getAvatar } from "@/utils/users/avatars/GetAvatars";
import { useUserData } from "./useUserData";

export const useConvertChat = (chat) => {
    const { state:userDataState } = useUserData();
    if (chat.users.length == 2) {
        for (const user of chat.users) {
            if (user.username != userDataState.value.username) {
                const avatar = getAvatar(user.username);
                return { chatAvatar: avatar, chatName: user.username, chatInfo: chat };
            }
        }
    }
}