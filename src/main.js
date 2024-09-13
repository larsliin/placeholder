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
    theme: {
        dark: true,
        themes: {
            light: {
                colors: {
                    primary: '#003354',
                    secondary: '#91BED4',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                },
            },
            dark: {
                dark: true,
                variables: {},
                colors: {
                    primary: '#91BED4',
                    anchor: '#f00',
                    secondary: '#f00',
                },
            },
        },
    },
});

const appElement = document.getElementById('app');

if (appElement) {
    const app = createApp(App);
    app.use(pinia).use(vuetify).mount('#app');
}
