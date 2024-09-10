import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import App from './App.vue';

const pinia = createPinia();

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});

const appElement = document.getElementById('app');

if (appElement) {
    const app = createApp(App);
    app.use(pinia).use(vuetify).mount('#app');
}
