import mitt from 'mitt';
import { useSharedWebStomp } from './useSharedWebStomp';

export const useWebstomp = (path) => {
    const emitter = mitt();
    const { stompClient } = useSharedWebStomp();
    stompClient.connect({}, () => {
        stompClient.subscribe(path, (message) => {
            emitter.emit('wsMessage', message);
        });
    });

    return {emitter};
}