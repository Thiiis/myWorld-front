import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
// CSS 변수/스타일
import '@/assets/css/fonts.css'
import '@/assets/css/variables.css'
import '@/assets/css/base.css'
import '@/assets/css/typography.css'
import '@/assets/css/theme.css'



const app = createApp(App);
app.use(router);
app.use(BootstrapVue3);
app.mount('#app');