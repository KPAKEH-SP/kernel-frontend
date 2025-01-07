<script setup>
    import { router } from '@/router';
    import { AxiosError } from 'axios';
    import { ref } from 'vue';
    import PrimaryButton from '@/components/ui/PrimaryButton.vue';
    import { PhFlashlight, PhSignIn, PhUserPlus } from '@phosphor-icons/vue';
    import FormSwitcherArrow from '@/components/ui/FormSwitcher.vue';
    import PasswordInput from '@/components/ui/PasswordInput.vue';
    import { useApi } from '@/composables/useApi';
import { useToken } from '@/composables/useToken';

    const error = ref('');
    const regUsername = ref('');
    const regEmail = ref('');
    const regPassword = ref('');
    const regPasswordConfirm = ref('');
    const loginUsername = ref('');
    const loginPassword = ref('');
    const regShowPassword = ref(false);
    const regShowConfirmPassword = ref(false);
    const loginShowPassword = ref(false);

    const activeSlot = ref('top');
    const regErrorShowed = ref(false);

    const userInfoApi = useApi({url: "api/auth/user-info", method: "get"})
    const token = useToken();

    const userInfo = () => {
        var storageToken = localStorage.getItem('token');
        if (storageToken == null) {
            return;
        }
        userInfoApi.execute()
        .then(function(response) {
            console.log('Redirect to: /')
            router.push({path: '/'});
            console.log(response);
        })
        .catch((error) => {
            if (error instanceof AxiosError) {
                if (error.response.status == 401 && error.response.data.message == "Expired token") {
                    activeSlot.value = 'bottom'
                }
            }
        });
    }

    const registerApi = useApi({url: "/api/auth/registration", method: "post"});

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
        
        var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (re.test(String(regEmail.value).toLowerCase()) == false) {
            error.value = 'Incorrect email';
            return;
        }
        
        //--- main logic ---

        regErrorShowed.value = false;

        registerApi.execute(0, {data: { username: regUsername.value, email: regEmail.value, password: regPassword.value}})
        .then(function (response) {
            localStorage.setItem("token", response);
            userInfo();
        })
        .catch(function (serverError) {
            console.log(serverError.response.message);
            error.value = serverError.response.message;
        });
    }

    const loginApi = useApi({url: "/api/auth/login", method: "post"})

    const login = () => {
        loginApi.execute(0, {data: {username: loginUsername.value, password: loginPassword.value}})
        .then(function(response) {
            token.value = response.token;
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
        <FormSwitcherArrow v-model:activeform = "activeSlot" class="arrow-container">
            <template #icon-top>
                <PhUserPlus :size="40"/>
            </template>
            <template #content-top>
                <div class="input-panel" >
                    <div v-if="regErrorShowed" class="error">{{error}}</div>
                    <input v-model="regUsername" type="text" name="username" placeholder="username" autocomplete="off">
                    <input v-model="regEmail" type="email" name="email" placeholder="email" autocomplete="off">
                    <PasswordInput v-model:passwordValue="regPassword"/>
                    <PasswordInput :placeholder="'confirm password'" v-model:passwordValue="regPasswordConfirm"/>
            
                    <PrimaryButton @click="register" text="register" size="" color=""/>
                </div>
            </template>

            <template #icon-bottom>
                <PhSignIn :size="40"/>
            </template>
            <template #content-bottom>
                <div class="input-panel">
                    <input v-model="loginUsername" type="text" placeholder="username" autocomplete="off">
                    <PasswordInput v-model:passwordValue="loginPassword"/>

                    <PrimaryButton @click="login" text="log in" size="" color=""/>
                </div>
            </template>
        </FormSwitcherArrow>
    </div>
</template>