import { defineStore } from 'pinia';
import actions from './_actions';
import getters from './_getters';

// eslint-disable-next-line
export const usePlaceholderStore = defineStore('placeholderStore', {
    state: () => ({
        theme: null,
    }),
    actions,
    getters,
});
