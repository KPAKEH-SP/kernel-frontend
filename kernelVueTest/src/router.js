import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from './pages/AuthPage.vue'
import MainPage from './pages/MainPage.vue'
import { useUserData } from './composables/useUserData'
import { watch } from 'vue'
import { useSharedWebStomp } from './composables/useSharedWebStomp'

const routes = [
  { path: '/auth', component: AuthPage },
  { 
    path: '/', 
    component: MainPage,
    beforeEnter: async (to, from, next) => {
      const { isReady, error } = useUserData();
      const authorized = await new Promise((resolve) => {
        const { stop } = watch([isReady, error], ([isReadyValue, errorValue]) => {
          if (isReadyValue) {
            stop();
            resolve(true);
          }
          else if (errorValue) {
            stop();
            resolve(false);
          }
        });
      })

      if (!authorized) {
        next('/auth');
        return;
      }

      const { isConnected } = useSharedWebStomp();
      await new Promise((resolve) => {
        watch(isConnected, (state) => {
          if (state) {
            resolve();
          }
        }, {immediate: true});
      })

      next();
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})