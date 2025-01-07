import { createSharedComposable } from "@vueuse/core";
import { useApi } from "./useApi";
import { useToken } from "./useToken";
import { watch } from "vue";

export const useUserData = createSharedComposable(() => {    
    const token = useToken();
    
    const getUserApi = useApi({url: "/api/auth/user-info", method: "get"});

    watch(token, () => {
        getUserApi.execute();
    }, {immediate: true});

    return getUserApi;
});