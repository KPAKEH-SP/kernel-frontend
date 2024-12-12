<script setup>
    import { PhFlashlight } from '@phosphor-icons/vue';
    import { ref } from 'vue';

    const showPassword = ref(false);

    const model = defineModel('passwordValue', {default:''});

</script>

<template>
    <form>
        <div class="input-container">
            <input
                v-model="model"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                placeholder="password"
                autocomplete="off"
            />
            <PhFlashlight
                @click="showPassword = !showPassword"
                :class="{
                    'show-password': showPassword === false,
                    'show-password-active': showPassword === true,
                }"
                :size="20"
            />
        </div>
    </form>
</template>

<style scoped>
    .input-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-container input {
        width: 100%;
        padding-right: 40px;
    }

    .show-password,
    .show-password-active {
        position: absolute;
        right: 10px;
        top: 23%;
        transition: all 0.5s ease;
        cursor: pointer;
    }

    .show-password-active {
        color: #00ffff;
        filter: drop-shadow(0 -10px 10px #00ffff);
        rotate: -90deg;
    }

    .show-password:hover{
        color: #00ffff;
        filter: drop-shadow(0 0 10px #00ffff);
    }
</style>