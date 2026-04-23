import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

// CSS 변수/스타일
import '@/assets/css/fonts.css'
import '@/assets/css/variables.css'
import '@/assets/css/base.css'
import '@/assets/css/typography.css'
import '@/assets/css/theme.css'

//Local 스토리지에 저장된 유저와 jwt를 읽고 전역 상태에 저장 
store.dispatch("loadAuth");

const app = createApp(App);
app.use(router);
app.use(BootstrapVue3);
app.use(store);
app.mount('#app');
