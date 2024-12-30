import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './webComponents/PixelCanvas.js'

createApp(App)
.use(router)
.mount('#app')

Notification.requestPermission((result) => {
    console.log(result);
  });