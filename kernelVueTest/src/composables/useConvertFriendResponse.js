import { getAvatar } from "@/utils/users/avatars/GetAvatars";
import { useSharedUsername } from "./useSharedUsername";

export const useConvertFriendResponse = (friendsResponse) => {
    const { username } = useSharedUsername();
    let convertedFriends = [];
    
    for (const friend of friendsResponse) {
        if (friend.user.username === username.value){
            const avatar = getAvatar(friend.pendingFrom.username);
            convertedFriends.push({
                avatar: avatar, 
                username: friend.pendingFrom.username, 
                status: friend.status,
                pendingFrom: friend.pendingFrom.username
            });
        } else {
            const avatar = getAvatar(friend.user.username);
            convertedFriends.push({
                avatar: avatar,
                username: friend.user.username,
                status: friend.status,
                pendingFrom: friend.pendingFrom.username
            });
        }
    }

    return convertedFriends;
}