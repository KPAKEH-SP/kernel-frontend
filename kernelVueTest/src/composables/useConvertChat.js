import { getAvatar } from "@/utils/users/avatars/GetAvatars";
import { useSharedUsername } from "./useSharedUsername";

export const useConvertChat = (chat) => {
    const { username } = useSharedUsername();
    if (chat.users.length == 2) {
        for (const user of chat.users) {
            if (user.username != username.value) {
                const avatar = getAvatar(user.username);
                return { chatAvatar: avatar, chatName: user.username, chatInfo: chat };
            }
        }
    }
}