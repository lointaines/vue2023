import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

import { zhCn } from 'element-plus/lib/locale'
const apiUrl = process.env.NODE_ENV === 'production'
    ? 'http://example.com/api'
    : 'http://localhost:8080'

// 在 axios 中使用全局的 apiUrl
axios.defaults.baseURL = apiUrl;

const app = createApp(App);
app.config.globalProperties.$axios = axios
app.use(router).use(ElementPlus, {
    locale: zhCn
}).mount('#app')
