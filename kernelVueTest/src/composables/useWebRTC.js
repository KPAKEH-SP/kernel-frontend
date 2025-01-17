import { useToken } from './useToken';
import { ref } from 'vue';
import { useSharedWebStomp } from './useSharedWebStomp';
import { createSharedComposable } from '@vueuse/core';
import { useCallData } from './useCallData';

export const useWebRTC = createSharedComposable(() => {
    const { stompClient } = useSharedWebStomp();
    const token = useToken();
    const { callInterlocutor } = useCallData();

    const localStream = ref(null);
    const remoteStream = ref(null);

    let peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    });

    let pendingCandidates = [];

    navigator.mediaDevices.getUserMedia({
        audio: true,
    })
    .then(stream => {
        localStream.value = stream;
        console.log("Local audio stream acquired.");
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    });

    const handleOffer = async (message) => {
        try {
            const offer = JSON.parse(message.body);

            if (peerConnection.signalingState !== "stable") {
                console.warn("PeerConnection is not in a stable state:", peerConnection.signalingState);
                return;
            }

            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnection.createAnswer();
            console.log("Created Answer SDP:", answer);

            await peerConnection.setLocalDescription(answer);
            console.log("Answer SDP set successfully:", peerConnection.localDescription);

            const payload = {
                senderToken: token.value,
                data: JSON.stringify(peerConnection.localDescription)
            };

            stompClient.send(`/kernel/webrtc/answer/user/${callInterlocutor.value}`, JSON.stringify(payload));

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
                senderToken: token.value,
                data: JSON.stringify(event.candidate)
            };

            stompClient.send(`/kernel/webrtc/candidate/user/${callInterlocutor.value}`, JSON.stringify(payload));
        }
    };

    const createOffer = () => {
        console.log('>>> OFFER CREATING <<<');        
        peerConnection.createOffer()
            .then(offer => peerConnection.setLocalDescription(offer))
            .then(() => {
                const payload = {
                    senderToken: token.value,
                    data: JSON.stringify(peerConnection.localDescription)
                };

                console.log('Offer SDP:', JSON.stringify(peerConnection.localDescription));
                stompClient.send(`/kernel/webrtc/offer/user/${callInterlocutor.value}`, JSON.stringify(payload));
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

        if (remoteStream.value.getAudioTracks().length > 0) {
            console.log("Remote audio is active.");
        } else {
            console.log("No remote audio found.");
        }
    };

    peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "connected") {
            console.log("WebRTC connection established successfully!");

            if (remoteStream.value && remoteStream.value.active) {
                console.log("Remote audio stream is active!");
                console.log("Remote audio stream tracks: ", remoteStream.value.getTracks());
            } else {
                console.log("Remote audio stream is not active.");
            }
        } else {
            console.log("WebRTC connection state:", peerConnection.connectionState);
        }

        console.log("Remote Stream: ", remoteStream.value);
    }

    const disconnect = () => {
        console.log("Disconnecting from chat...");

        if (localStream.value) {
            localStream.value.getTracks().forEach(track => track.stop());
            localStream.value = null;
        }
        
        if (remoteStream.value) {
            remoteStream.value.getTracks().forEach(track => track.stop());
            remoteStream.value = null;
        }

        peerConnection.close();

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