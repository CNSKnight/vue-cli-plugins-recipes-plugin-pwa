// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue';
import router from './router';
import store from './store';
import '@/components/_globals/';
import App from './App';

/* eslint-disable no-new */
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
