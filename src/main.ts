import '@xterm/xterm/css/xterm.css';
import '@icon-park/vue-next/styles/index.css';
import './assets/main.css';

import '@xterm/xterm/lib/xterm.js';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
