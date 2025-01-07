import { useApi } from "./useApi";
import { useConvertFriendResponse } from "./useConvertFriendResponse";
import { useUserData } from "./useUserData";

export const useFriendApi = (action, friendUsername) => {
    const removeFriendApi = useApi({url: `api/friends/${ action }`, method: "post"});
        removeFriendApi.execute(0, {data: {username: friendUsername}})
        .then(function(response) {
            return useConvertFriendResponse(response);
        }).catch(function(error) {
            console.log(error);
        });
}