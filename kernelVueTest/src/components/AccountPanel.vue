<script setup>
    import PrimaryButton from './ui/PrimaryButton.vue';
    import { router } from '@/router';
    import { ref } from 'vue';
    import axios from 'axios';
    import { getAvatar } from '@/utils/users/avatars/GetAvatars';

    const showCircles = ref(false);

    const avatar = defineModel('avatar', {type: String});

    const props = defineProps({
        username:{type:String, required:true},
        token:{type:String, required:true}
    });

    const handleLogOut = () => {
        localStorage.removeItem("token");
        router.push({path: "/auth"});
    }

    const fileInput = ref(null);

    const openFileDialog = () => {
        fileInput.value.click();
    };

    const uploadAvatar = async (event) => {
        const file = event.target.files[0];
        if (file == null || file == undefined) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://194.87.140.155:8080/tcp/api/users/avatar/upload/' + props.token, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob'
            });
            
            console.log(response);

            avatar.value = getAvatar(props.username, true);
            
            console.log("Аватар загружен успешно");
        } catch (error) {
            console.error('Ошибка загрузки аватарки:', error);
        }
    };
</script>


<template>
    <div class="account-panel">
        <button 
        @mouseenter="showCircles = true" 
        @mouseleave="showCircles = false" 
        @click="openFileDialog"  
        class="avatar">
            <img :src="avatar" alt="Avatar" class="avatar-image" />
            <div v-if="showCircles" class="spinning-circles" id="circles">
                <div class="spinning-circle"></div>
                <div class="spinning-circle"></div>
                <div class="spinning-circle"></div>
                <div class="spinning-circle"></div>
            </div>
        </button>

        <input 
            type="file" 
            ref="fileInput" 
            @change="uploadAvatar" 
            style="display: none;" 
        />

        <div>{{ props.username }}</div>
        <PrimaryButton @click="handleLogOut" text="log out" size="" color="red"/>
    </div>
</template>

<style>
    .account-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
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

    .avatar:hover {
        border-color: transparent;
        color: #00ffff;
    }

    .spinning-circles {
        width: 100%; 
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinning-circle {
        box-sizing: border-box;
        position: absolute;
        width: 120%;
        height: 120%;
        border: 1vmin solid transparent;
        border-radius: 115% 140% 145% 110%/125% 140% 110% 125%;
        mix-blend-mode: screen;
        pointer-events: none;
        box-shadow: #00ffff 0 0 3px, inset #00ffff 0 0 3px;
    }

    .spinning-circle:nth-child(1) {
        border-color: #00ffff;
        transform-origin: 50% 50%;
        animation: spin1 5.5s linear infinite;
    }

    .spinning-circle:nth-child(2) {
        border-color: #00b6b6;
        transform-origin: 50% 50%;
        animation: spin2 5.5s linear infinite;
    }

    .spinning-circle:nth-child(3) {
        border-color: #009c9c;
        transform-origin: 50% 50%;
        animation: spin3 5.5s linear infinite;
    }

    .spinning-circle:nth-child(4) {
        border-color: #006868;
        transform-origin: 50% 50%;
        animation: spin4 5.5s linear infinite;
    }

    @keyframes spin1 {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes spin2 {
        0% {
            transform: rotate(72deg);
        }
        100% {
            transform: rotate(-288deg);
        }
    }

    @keyframes spin3 {
        0% {
            transform: rotate(-144deg);
        }
        100% {
            transform: rotate(216deg);
        }
    }

    @keyframes spin4 {
        0% {
            transform: rotate(216deg);
        }
        100% {
            transform: rotate(-144deg);
        }
    }

    .avatar-upload {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
}

.file-input {
  display: block;
  margin: 10px auto;
}

.upload-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.upload-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.preview img {
  max-width: 100%;
  border-radius: 50%;
  margin-top: 10px;
}
</style>