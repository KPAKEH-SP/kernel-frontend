<script setup>
    import { router } from '@/router';
    import axios, { AxiosError } from 'axios';
    import { ref } from 'vue';
    import PrimaryButton from '@/components/ui/PrimaryButton.vue';

    const error = ref('');
    const regUsername = ref('');
    const regEmail = ref('');
    const regPassword = ref('');
    const regPasswordConfirm = ref('');
    const loginUsername = ref('');
    const loginPassword = ref('');

    const openedRegPanel = ref(false);
    const openedLoginPanel = ref(false);
    const regErrorShowed = ref(false);

    const userInfo = () => {
        var storageToken = localStorage.getItem('token');
        if (storageToken == null) {
            openedLoginPanel.value = true;
            return;
        }
        axios.post("http://194.87.140.155:8080/api/auth/user-info", {
            token: storageToken
        })
        .then(function(response) {
            console.log('Redirect to: /')
            router.push({path: '/'});
            console.log(response);
        })
        .catch((error) => {
            if (error instanceof AxiosError) {
                if (error.response.status == 401 && error.response.data.message == "Expired token") {
                    openedLoginPanel.value = true;
                }
            }
        });
    }

    const register = () => {
        regErrorShowed.value = true;

        //--- empty input's validation ---

        if(regUsername.value == '') {
            error.value = 'Username not specified';
            return;
        } else if (regEmail.value == '') {
            error.value = 'Email not specified';
            return;
        } else if (regPassword.value == '') {
            error.value = 'Password not specified';
            return;
        } else if (regPasswordConfirm.value == '') {
            error.value = 'Password not confirmed';
            return;
        }

        //--- password validation ---

        if (/^(?=.*\d)/.test(regPassword.value) == false) {
            error.value = 'The password must contain at least one number';
            return;
        }

        if (/^(?=.*[a-z])/.test(regPassword.value) == false) {
            error.value = 'The password must contain at least one lowercase letter';
            return;
        }

        if (/^(?=.*[A-Z])/.test(regPassword.value) == false) {
            error.value = 'The password must contain at least one uppercase letter';
            return;
        }

        if (/^.{8,}/.test(regPassword.value == false)) {
            error.value = 'The minimum password length is eight characters';
            return;
        }

        if (/^ /.test(regPassword.value == true)) {
            error.value = 'The password must not contain a spaces';
            return;
        }

        if (regPassword.value != regPasswordConfirm.value) {
            error.value = 'The passwords do not match';
            return;
        }

        //--- username validation ---

        if (/^ /.test(regUsername.value) == true) {
            error.value = 'The username must not contain a spaces'
            return;
        }

        //--- email validation ---
        
        //TODO: переделать валидацию

        var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (re.test(String(regEmail.value).toLowerCase()) == false) {
            error.value = 'Incorrect email';
            return;
        }
        
        //--- main logic ---

        regErrorShowed.value = false;

        axios.post('http://194.87.140.155:8080/api/auth/registration', {
            username: regUsername.value,
            email: regEmail.value,
            password: regPassword.value
        })
        .then(function (response) {
            localStorage.setItem("token", response.data);
            userInfo();
        })
        .catch(function (serverError) {
            console.log(serverError.response.data.message);
            regError.style.display = 'flex';
            error.value = serverError.response.data.message;
        });
    }

    const login = () => {
        axios.post("http://194.87.140.155:8080/api/auth/login", {
            username: loginUsername.value,
            password: loginPassword.value
        })
        .then(function(response) {
            localStorage.setItem("token", response.data.token);
            router.push({path: '/'});
        })
        .catch(function (error) {
            console.log(error);
        });
    }
</script>

<template>
    <div class="circles" id="circles">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>

        <div v-if="!openedLoginPanel && !openedRegPanel" id="main-panel" class="main-panel">
            <PrimaryButton @click="openedRegPanel = true" text="create account" size=" -xl" color=""/>
            <PrimaryButton @click="openedLoginPanel = true" text="log in" size=" -xl" color=""/>
        </div>

        <div v-if="openedRegPanel" class="input-panel" >
            <div v-if="regErrorShowed" class="error">{{error}}</div>
            <input v-model="regUsername" type="text" name="username" placeholder="username" autocomplete="off">
            <input v-model="regEmail" type="email" name="email" placeholder="email" autocomplete="off">
            <form>
                <input v-model="regPassword" type="password" name="password" placeholder="password" autocomplete="off">
            </form>
            <form>
                <input v-model="regPasswordConfirm" type="password" placeholder="confirm password" autocomplete="off">
            </form>
    
            <PrimaryButton @click="register" text="register" size="" color=""/>
            <PrimaryButton @click="openedRegPanel = false" text="back" size="" color=""/>
        </div>

        <div v-if="openedLoginPanel" class="input-panel">
            <input v-model="loginUsername" type="text" placeholder="username" autocomplete="off">
            <form>
                <input v-model="loginPassword" type="password" placeholder="password" autocomplete="off">
            </form>

            <PrimaryButton @click="login" text="log in" size="" color=""/>
            <PrimaryButton @click="openedLoginPanel = false" text="back" size="" color=""/>
        </div>
    </div>
</template>