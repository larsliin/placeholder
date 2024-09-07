import { createApp } from 'vue';
import { createPinia } from 'pinia';
import mitt from 'mitt';
import './style.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import App from './App.vue';
import AppPopup from './AppPopup.vue';

const emitter = mitt();

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
    app.config.globalProperties.emitter = emitter;
    app.use(pinia).use(vuetify).mount('#app');
}

const appPopupElement = document.getElementById('appPopup');

if (appPopupElement) {
    const appPopup = createApp(AppPopup);
    appPopup.config.globalProperties.emitter = emitter;
    appPopup.use(pinia).use(vuetify).mount('#appPopup');
}
