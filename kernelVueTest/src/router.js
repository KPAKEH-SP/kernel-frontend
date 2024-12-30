import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from './pages/AuthPage.vue'
import MainPage from './pages/MainPage.vue'
import { useSharedUsername } from './composables/useSharedUsername'
import { watch } from 'vue'

const routes = [
  { path: '/auth', component: AuthPage },
  { 
    path: '/', 
    component: MainPage,
    beforeEnter: async (to, from, next) => {
      const { username } = useSharedUsername();
      if (!username.value) {
        await new Promise((resolve) => {
          watch(username, (state) => {
            if (state != ''){
              resolve();
            }
          });
        })
      }
      next();
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})