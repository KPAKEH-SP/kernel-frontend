import Webstomp from 'webstomp-client';
import SockJS from 'sockjs-client';
import mitt from 'mitt';

let stompClient = null;


export const useWebstomp = (path) => {
    const socket = new SockJS('/ws');
    stompClient = Webstomp.over(socket)
    const emitter = mitt();
    
    stompClient.connect({}, () => {
        stompClient.subscribe(path, (message) => {
            emitter.emit('wsMessage', message);
        });
    });

    return {emitter};
}