import { createSharedComposable } from "@vueuse/core";
import { useApi } from "./useApi";
import { router } from "@/router";
import { useToken } from "./useToken";
import { ref } from "vue";

export const useSharedUsername = createSharedComposable(() => {    
    const username = ref('');
    const token = useToken();
    
    const getUserApi = useApi({url: "/api/auth/user-info", method: "get"});
    const checkToken = async () => {
        try {
            if (token != null) {   
                await getUserApi.execute()
                .then(function(response) {
                    username.value = response.username;
                });
            } else {
                throw new Error("token is empty");
            }
        } catch (error) {
            router.push({path: '/auth'});
        }
    }

    checkToken();

    return { username };
});