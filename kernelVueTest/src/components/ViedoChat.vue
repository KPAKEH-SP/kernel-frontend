<template>
  <div class="audio-chat">
    <div class="user">
      You
      <audio ref="localAudio" autoplay muted></audio>
    </div>
    <div class="user">
      <audio ref="remoteAudio" autoplay></audio>
    </div>
  </div>
</template>

<script setup>
  import { useWebRTC } from '@/composables/useWebRTC';
  import { ref, onMounted, watch } from 'vue';

  // Инициализация WebRTC
  const { localStream, remoteStream } = useWebRTC();

  // Привязываем аудио элементы через ref
  const localAudio = ref(null);
  const remoteAudio = ref(null);

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
        remoteAudio.value.srcObject = stream;  // Устанавливаем поток на удалённое аудио
      }
    });
  });
</script>

<style scoped>
.audio-chat {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Высота родительского контейнера (по высоте окна браузера) */
}

.user {
    justify-content: center;
    align-items: center;
    position: relative;
    display: flex;
    align-items: center;
    height: 100px;
    width: 100px;
    border: solid #fff;
    border-radius: 50%;
    box-sizing: border-box;
    background: transparent;
    margin: 20px;
    }
</style>