import { useApi } from "./useApi";
import { useConvertFriendResponse } from "./useConvertFriendResponse";
import { useSharedUsername } from "./useSharedUsername";

export const useFriendApi = (action, friendUsername) => {
    const { username } = useSharedUsername();

    const removeFriendApi = useApi({url: `api/friends/${ action }`, method: "post"});
        removeFriendApi.execute(0, {data: {username: friendUsername}})
        .then(function(response) {
            return useConvertFriendResponse(response);
        }).catch(function(error) {
            console.log(error);
        });
}