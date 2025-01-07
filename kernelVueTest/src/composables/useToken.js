import { createSharedComposable, useLocalStorage } from "@vueuse/core"

export const useToken = createSharedComposable(() => {
    return useLocalStorage(
        "token",
        undefined,
        { deep:false }
    )
});