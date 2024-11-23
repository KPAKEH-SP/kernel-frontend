<script setup>
    import { router } from '@/router';
    import axios, { AxiosError } from 'axios';
    import { ref } from 'vue';
    import PrimaryButton from '@/components/ui/PrimaryButton.vue';

    let currentPanel = 'main-panel';
    let error = ref('');
    let regUsername = '';
    let regEmail = '';
    let regPassword = '';
    let regPasswordConfirm = ''
    let loginUsername = '';
    let loginPassword = '';

    const openPanel = (newPanel) => {
        document.getElementById(currentPanel).style.display = "none";
                currentPanel = newPanel;
                document.getElementById(newPanel).style.display = "flex";
    }

    const userInfo = () => {
        var storageToken = localStorage.getItem('token');
        if (storageToken == null) {
            openPanel('login-panel');
            return;
        }
        axios.post("http://localhost:8080/api/auth/user-info", {
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
                    openPanel('login-panel');
                }
            }
        });
    }

    const register = () => {
        let regError = document.getElementById('reg-error')
        regError.style.display = 'flex';

        //--- empty input's validation ---

        if(regUsername == '') {
            error.value = 'Username not specified';
            return;
        } else if (regEmail == '') {
            error.value = 'Email not specified';
            return;
        } else if (regPassword == '') {
            error.value = 'Password not specified';
            return;
        } else if (regPasswordConfirm == '') {
            error.value = 'Password not confirmed';
            return;
        }

        //--- password validation ---

        if (/^(?=.*\d)/.test(regPassword) == false) {
            error.value = 'The password must contain at least one number';
            return;
        }

        if (/^(?=.*[a-z])/.test(regPassword) == false) {
            error.value = 'The password must contain at least one lowercase letter';
            return;
        }

        if (/^(?=.*[A-Z])/.test(regPassword) == false) {
            error.value = 'The password must contain at least one uppercase letter';
            return;
        }

        if (/^.{8,}/.test(regPassword == false)) {
            error.value = 'The minimum password length is eight characters';
            return;
        }

        if (/^ /.test(regPassword == true)) {
            error.value = 'The password must not contain a spaces';
            return;
        }

        if (regPassword != regPasswordConfirm) {
            error.value = 'The passwords do not match';
            return;
        }

        //--- username validation ---

        if (/^ /.test(regUsername) == true) {
            error.value = 'The username must not contain a spaces'
            return;
        }

        //--- email validation ---
        
        //TODO: переделать валидацию

        /*var re = /^(([^&lt;&gt;()\[\]\\.,;:\s@"]+(\.[^&lt;&gt;()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(String(this.regEmail).toLowerCase()) == false) {
            this.error = 'Incorrect email';
            return;
        }*/
        
        //--- main logic ---

        regError.style.display = 'none';

        axios.post('http://localhost:8080/api/auth/registration', {
            username: regUsername,
            email: regEmail,
            password: regPassword
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
        axios.post("http://localhost:8080/api/auth/login", {
            username: loginUsername,
            password: loginPassword
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

        <div id="main-panel" class="main-panel">
            <PrimaryButton @click="openPanel('reg-panel')" text="create account" size=" -xl"/>
            <PrimaryButton @click="openPanel('login-panel')" text="log in" size=" -xl"/>
        </div>

        <div id="reg-panel" class="input-panel -hidden-panel" >
            <div id="reg-error" class="hidden -error">{{error}}</div>
            <input v-model="regUsername" type="text" name="username" placeholder="username" autocomplete="off">
            <input v-model="regEmail" type="email" name="email" placeholder="email" autocomplete="off">
            <input v-model="regPassword" type="password" name="password" placeholder="password" autocomplete="off">
            <input v-model="regPasswordConfirm" type="password" placeholder="confirm password" autocomplete="off">
    
            <PrimaryButton @click="register" text="register" size=""/>
            <PrimaryButton @click="openPanel('main-panel')" text="back" size=""/>
        </div>

        <div id="login-panel" class="input-panel -hidden-panel" autocomplete="off">
            <input v-model="loginUsername" type="text" placeholder="username" autocomplete="off">
            <input v-model="loginPassword" type="password" placeholder="password" autocomplete="off">

            <PrimaryButton @click="login" text="log in" size=""/>
            <PrimaryButton @click="openPanel('main-panel')" text="back" size=""/>
        </div>
    </div>
</template>