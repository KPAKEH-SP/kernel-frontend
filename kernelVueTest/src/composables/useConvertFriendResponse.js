import { getAvatar } from "@/utils/users/avatars/GetAvatars";
import { useUserData } from "./useUserData";

export const useConvertFriendResponse = (friendsResponse) => {
    const { state:userDataState } = useUserData();
    let convertedFriends = [];
    
    for (const friend of friendsResponse) {
        if (friend.user.username === userDataState.value.username){
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