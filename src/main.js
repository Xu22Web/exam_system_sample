import { createApp } from 'vue'
import router from './router';
import store from './store';
import App from './App.vue'
import "./static/css/main.css"
// 新建app
const app = createApp(App);
app.use(router).use(store).mount('#app');