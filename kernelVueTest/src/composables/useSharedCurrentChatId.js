import { createSharedComposable } from "@vueuse/core";
import { ref } from "vue";

export const useSharedCurrentChatId = createSharedComposable(() => {
    const currentChatId = ref('');

    const setChatId = (newChatId) => {
        currentChatId.value = newChatId;
    }

    return { setChatId, currentChatId };
});