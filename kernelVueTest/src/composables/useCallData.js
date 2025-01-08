import { createSharedComposable } from "@vueuse/core";
import { ref } from "vue";

export const useCallData = createSharedComposable(() => {
   const callInterlocutor = ref('');
   return { callInterlocutor };  
});