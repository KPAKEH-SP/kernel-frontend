<script setup>
  import { getAvatar } from '@/utils/users/avatars/GetAvatars';
  import { ref } from 'vue';

  const props = defineProps({
      username:{type:String, required:true}
  });

  const isFlipped = ref(false);
  const showCircles = ref(false);

  const toggleFlip = () => {
  isFlipped.value = !isFlipped.value;
  if (isFlipped.value) {
    showCircles.value = false;
  } else {
    showCircles.value = true;
  }
  };

  const showCirclesTrue = () => {
    if (isFlipped.value == false) {
      showCircles.value = true;
    }
  }
</script>

<template>
  <div class="card-container" 
        :class="{ flipped: isFlipped }"
        @mouseenter="showCirclesTrue" 
        @mouseleave="showCircles = false" 
        @click="toggleFlip">
    <div class="card">
      <div class="card-front">
        <div class="avatar">
          <img :src="getAvatar(props.username)" class="avatar-image" onerror="this.style.display='none';"/>
          <div v-if="showCircles" class="spinning-circles" id="circles">
              <div class="spinning-circle"></div>
              <div class="spinning-circle"></div>
              <div class="spinning-circle"></div>
              <div class="spinning-circle"></div>
          </div>
        </div>

        <div class="friend-name">
          {{ props.username }}
        </div>
      </div>
      <div class="card-back">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
  .card-container {
    width: 200px;
    height: 300px;
    perspective: 1000px;
    display: inline-block;
    cursor: pointer;
    padding: 5%;
    margin: 10px;
  }
  
  .card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }
  
  .card-container:hover .card {
    transform: scale(1.03);
  }
  
  .card-container.flipped .card {
    transform: rotateY(180deg);
  }
  
  .card-front,
  .card-back {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    color: white;
    border-radius: 8px;
  }
  
  .card-front {
    background-color: #000;
    border: solid #fff 3px;
    border-radius: 1vh;
  }
  
  .card-back {
    background-color: #000;
    border: solid #00ffff 3px;
    border-radius: 1vh;
    box-shadow: #00ffff 0 0 10px, inset #00ffff 0 0 10px;
    transform: rotateY(180deg);
  }

  .avatar {
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
    }

  .avatar-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .friend-name {
    margin-top: 5%;
    text-align: center;
  }
</style>