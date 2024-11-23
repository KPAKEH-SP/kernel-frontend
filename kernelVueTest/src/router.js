import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from './pages/AuthPage.vue'
import MainPage from './pages/MainPage.vue'

const routes = [
  { path: '/auth', component: AuthPage },
  { path: '/', component: MainPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})