import UiCanvas from './models/Canvas';

export const EMITS = Object.freeze({
    SAVE: 'save',
});

export const PLACEHOLDER_IMAGE = Object.freeze({
    CANVAS: new UiCanvas(
        '500',
        '500',
        './src/assets/images/placeholder.png',
    ),
    COLORS: ['#0ac0e9', '#ff9933', '#9393ff', '#ffff7e', '#7cff95', '#ff7f7f'],
});
