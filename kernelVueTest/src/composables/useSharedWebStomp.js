import { createSharedComposable } from "@vueuse/core";
import SockJS from "sockjs-client";
import { ref } from "vue";
import webstomp from "webstomp-client";

export const useSharedWebStomp = createSharedComposable(() => {
    const socket = new SockJS('ws');
    const stompClient = webstomp.over(socket);
    const isConnected = ref(false);

    stompClient.connect({}, () => {
        isConnected.value = stompClient.connected;
        console.log("REF IN CONNECT >>> ", isConnected.value);
        console.log("STOMP CLIENT IN CONNECT >>> ", stompClient.connected);
    })

    console.log("REF >>> ", isConnected.value);
    console.log("STOMP CLIENT >>> ", stompClient.connected);

    return { stompClient, isConnected };
})