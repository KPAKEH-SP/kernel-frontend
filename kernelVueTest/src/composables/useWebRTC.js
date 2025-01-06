import { useToken } from './useToken';
import { ref } from 'vue';
import { useSharedWebStomp } from './useSharedWebStomp';
import { createSharedComposable } from '@vueuse/core';
import { useSharedChats } from './useSharedChats';

export const useWebRTC = createSharedComposable(() => {
    const { stompClient } = useSharedWebStomp();
    const token = useToken();
    const { currentChat } = useSharedChats();

    const localStream = ref(null);
    const remoteStream = ref(null);

    let peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    });  // Инициализация соединения сразу

    let pendingCandidates = [];

    // Запрашиваем только аудио
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false  // Отключаем видео
    })
    .then(stream => {
        localStream.value = stream;
        console.log("Local audio stream acquired.");
        // Добавляем только аудио треки в PeerConnection
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        // Проверка состояния локальных потоков
        if (localStream.value.getAudioTracks().length > 0) {
            console.log("Local audio is active.");
        } else {
            console.log("No local audio found.");
        }
    })
    .catch(error => {
        console.error("Error accessing media devices:", error);
    });

    const handleOffer = async (message) => {
        try {
            const jsonBody = JSON.parse(message.body);
            if (jsonBody.chatId !== currentChat.value.chatInfo.chatId) {
                console.warn("Received offer for different chat ID:", jsonBody.chatId);
                return;
            }

            const offerData = JSON.parse(jsonBody.data);

            if (peerConnection.signalingState !== "stable") {
                console.warn("PeerConnection is not in a stable state:", peerConnection.signalingState);
                return;
            }

            await peerConnection.setRemoteDescription(new RTCSessionDescription(offerData));

            const answer = await peerConnection.createAnswer();
            console.log("Created Answer SDP:", answer);

            await peerConnection.setLocalDescription(answer);
            console.log("Answer SDP set successfully:", peerConnection.localDescription);

            const payload = {
                chatId: jsonBody.chatId,
                respondentToken: token.value,
                initiatorUsername: jsonBody.initiatorUsername,
                data: JSON.stringify(peerConnection.localDescription)
            };

            stompClient.send(`/kernel/webrtc/chat/answer`, JSON.stringify(payload));

            console.log('CANDIDATES BEFORE HANDLE OFFER >>> ', pendingCandidates);
            pendingCandidates.forEach(candidate => peerConnection.addIceCandidate(candidate));
            pendingCandidates = [];
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    };

    const handleAnswer = (message) => {
        console.log('ANSWER HANDLING >>> ', message);
        const answer = JSON.parse(message.body);

        if (peerConnection.signalingState !== "have-local-offer") {
            return;
        }

        peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
        .then(() => {
            console.log('CANDIDATES BEFORE HANDLE ANSWER >>> ', pendingCandidates);
            pendingCandidates.forEach(candidate => {
                peerConnection.addIceCandidate(candidate)
                    .catch(error => console.error("Error adding ICE candidate:", error));
            });
            pendingCandidates = [];
        });
    }

    const handleCandidate = (message) => {
        console.log('CANDIDATE HANDLING >>> ', message);
        const iceCandidate = JSON.parse(message.body);
        
        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
        } else {
            pendingCandidates.push(new RTCIceCandidate(iceCandidate));
        }
    }

    peerConnection.onicecandidate = event => {
        console.log("New ICE candidate:", event.candidate);
        if (event.candidate) {
            const payload = {
                chatId: currentChat.value.chatInfo.chatId,
                initiatorToken: token.value,
                data: JSON.stringify(event.candidate)
            };

            stompClient.send(`/kernel/webrtc/chat/candidate`, JSON.stringify(payload));
        }
    };

    const createOffer = () => {
        console.log('>>> OFFER CREATING <<<');        
        peerConnection.createOffer()
            .then(offer => peerConnection.setLocalDescription(offer))
            .then(() => {
                const payload = {
                    chatId: currentChat.value.chatInfo.chatId,
                    initiatorToken: token.value,
                    data: JSON.stringify(peerConnection.localDescription)
                };

                console.log('Offer SDP:', JSON.stringify(peerConnection.localDescription));
                stompClient.send(`/kernel/webrtc/chat/offer`, JSON.stringify(payload));
            });
    }

    peerConnection.ontrack = event => {
        if (!remoteStream.value) {
            remoteStream.value = new MediaStream();
            console.log("Remote audio stream created.");
        }
        event.streams[0].getTracks().forEach(track => {
            if (!remoteStream.value.getTracks().includes(track)) {
                remoteStream.value.addTrack(track);
            }
        });

        // Проверка полученного аудио
        if (remoteStream.value.getAudioTracks().length > 0) {
            console.log("Remote audio is active.");
        } else {
            console.log("No remote audio found.");
        }
    };

    peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "connected") {
            console.log("WebRTC connection established successfully!");

            // Проверка содержимого remoteStream
            if (remoteStream.value && remoteStream.value.active) {
                console.log("Remote audio stream is active!");
                console.log("Remote audio stream tracks: ", remoteStream.value.getTracks());
            } else {
                console.log("Remote audio stream is not active.");
            }
        } else {
            console.log("WebRTC connection state:", peerConnection.connectionState);
        }

        // Вывод информации о remoteStream
        console.log("Remote Stream: ", remoteStream.value);
    }

    // Метод для отключения пользователя от чата
    const disconnect = () => {
        console.log("Disconnecting from chat...");

        // Отключение и остановка всех треков
        if (localStream.value) {
            localStream.value.getTracks().forEach(track => track.stop());
            localStream.value = null;
        }
        
        if (remoteStream.value) {
            remoteStream.value.getTracks().forEach(track => track.stop());
            remoteStream.value = null;
        }

        // Закрытие соединения PeerConnection
        peerConnection.close();

        // Создаем новое соединение для следующего звонка
        console.log("Disconnected from chat.");
    }

    return {
        localStream,
        remoteStream,
        handleOffer,
        handleAnswer,
        handleCandidate,
        createOffer,
        disconnect
    };
});