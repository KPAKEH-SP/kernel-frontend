import { useLocalStorage } from "@vueuse/core"

export const useToken = () => {
    return useLocalStorage(
        "token",
        undefined,
        { deep:false }
    )
}