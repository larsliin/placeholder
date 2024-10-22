import { defineStore } from 'pinia';
import actions from './_actions';
import getters from './_getters';

// eslint-disable-next-line
export const usePlaceholderStore = defineStore('placeholderStore', {
    state: () => ({
        model: {
        },
        canvas: null,
        savedTotal: 0,
    }),
    actions,
    getters,
});
