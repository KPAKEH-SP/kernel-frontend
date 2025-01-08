<template>
  <div :class="$style.root">
    <div :class="$style.users">
      <div :class="$style.user">
        <UserAvatar :username="userDataState.username"/>
      </div>
      <audio ref="localAudio" autoplay muted></audio>
      <div v-if="friendConnected" :class="$style.user">
        <UserAvatar :username="callInterlocutor"/>
      </div>
      <audio ref="remoteAudio" autoplay></audio>
    </div>
    <div :class="$style['bottom-panel']">
        <PhPhoneX @click="emits('disconnected')" :size="40" :class="$style['bottom-button']"/>
    </div>
  </div>
</template>

<script setup>
  import { useWebRTC } from '@/composables/useWebRTC';
  import { PhPhoneX } from '@phosphor-icons/vue';
  import { onMounted, ref, watch } from 'vue';
  import UserAvatar from './ui/UserAvatar.vue';
  import { useUserData } from '@/composables/useUserData';
  import { useCallData } from '@/composables/useCallData';

  // Инициализация WebRTC
  const { localStream, remoteStream } = useWebRTC();

  // Привязываем аудио элементы через ref
  const localAudio = ref(null);
  const remoteAudio = ref(null);
  const friendConnected = ref(false);
  const {state:userDataState} = useUserData();
  const { callInterlocutor } = useCallData(); 
  const emits = defineEmits(['disconnected'])

  onMounted(() => {  
    // Устанавливаем локальный поток в аудио элемент
    watch(localStream, (stream) => {
      if (localAudio.value && stream) {
        localAudio.value.srcObject = stream;  // Устанавливаем поток на локальное аудио
      }
    });

    // Устанавливаем удалённый поток в аудио элемент
    watch(remoteStream, (stream) => {
      if (remoteAudio.value && stream) {
        friendConnected.value = true;
        console.log("FRIEND CONNECTED >>> ", friendConnected.value);
        remoteAudio.value.srcObject = stream;
      }
    });
  });
</script>

<style module>
.root {
  height: 60vh;
  width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bottom-panel {
  display: flex;
  justify-self: end;
  height: max-content;
  width: 100%;
  border: solid #fff 1px;
  border-radius: 200px;
  align-items: center;
  justify-content: center;
}

.users {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.user {
  justify-content: center;
  align-items: center;
  position: relative;
  display: flex;
  align-items: center;
  height: 100px;
  width: 100px;
  box-sizing: border-box;
  background: transparent;
  margin: 20px;
}

.bottom-button {
  color: #fff;
  align-self: center;
  justify-self: end;
  margin: 1%;
  transition: all 0.5s ease;
}

.bottom-button:hover {
  color: #ff4343;
  filter: drop-shadow(0 0 5px #ff4343);
  cursor: pointer;
}
</style>