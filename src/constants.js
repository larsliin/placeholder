import UiCanvas from './models/Canvas';
import UiText from './models/Text';

export const EMITS = Object.freeze({
    CLICK: 'click',
    COPY: 'copy',
    BLUR: 'blur',
    FOCUS: 'focus',
    SAVE: 'save',
    UPDATE_TAB: 'updateTab',
});

export const STORAGE = Object.freeze({
    IMAGE_COLOR: 'image_color',
    IMAGE_HEIGHT: 'image_height',
    IMAGE_MIMETYPE: 'image_mimetype',
    IMAGE_WIDTH: 'image_width',
    PARAGRAPH_COUNT: 'paragraph_count,',
    SAVED_ITEMS: 'saved_items',
    SELECTED_SAVED_ITEM: 'selected_saved_item',
    TAB: 'tab',
    TEXT: 'text',
    URL: 'url',
    WORD_COUNT: 'word_count',
    PREFIX_LOREM_IPSUM: 'prefix_lorem_ipsum',
});

export const PLACEHOLDER = Object.freeze({
    CANVAS: new UiCanvas(
        350,
        250,
        '<svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><style>.cls-1{fill:#231f20;}.cls-2{fill:none;stroke:#231f20;stroke-miterlimit:10;stroke-width:47px;}</style></defs><path class="cls-2" d="M24,343.52V66.86c0-23.12,18.72-41.86,41.82-41.86h366.89c23.1,0,41.82,18.74,41.82,41.86v241.8"/><path class="cls-2" d="M24,343.52v90.61c0,23.12,18.72,41.86,41.82,41.86h366.89c2.51,0,4.96-.23,7.34-.66"/><path class="cls-2" d="M474.53,308.67v125.47c0,20.61-14.88,37.73-34.48,41.21"/><path class="cls-2" d="M24,349.52l120.61-112.73c16.33-16.35,42.81-16.35,59.14,0l239.3,232.55"/><path class="cls-2" d="M293.62,330.13l63.61-62.68c16.33-16.35,42.81-16.35,59.14,0l58.63,57.05"/><path class="cls-1" d="M312.2,150c6.9,0,12.49,5.6,12.49,12.5s-5.59,12.5-12.49,12.5-12.49-5.6-12.49-12.5,5.59-12.5,12.49-12.5M312.2,126c-20.12,0-36.49,16.37-36.49,36.5s16.37,36.5,36.49,36.5,36.49-16.37,36.49-36.5-16.37-36.5-36.49-36.5h0Z"/></svg>',
        '<svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><style>.cls-1{fill:#eeeeee;}.cls-2{fill:none;stroke:#eeeeee;stroke-miterlimit:10;stroke-width:47px;}</style></defs><path class="cls-2" d="M24,343.52V66.86c0-23.12,18.72-41.86,41.82-41.86h366.89c23.1,0,41.82,18.74,41.82,41.86v241.8"/><path class="cls-2" d="M24,343.52v90.61c0,23.12,18.72,41.86,41.82,41.86h366.89c2.51,0,4.96-.23,7.34-.66"/><path class="cls-2" d="M474.53,308.67v125.47c0,20.61-14.88,37.73-34.48,41.21"/><path class="cls-2" d="M24,349.52l120.61-112.73c16.33-16.35,42.81-16.35,59.14,0l239.3,232.55"/><path class="cls-2" d="M293.62,330.13l63.61-62.68c16.33-16.35,42.81-16.35,59.14,0l58.63,57.05"/><path class="cls-1" d="M312.2,150c6.9,0,12.49,5.6,12.49,12.5s-5.59,12.5-12.49,12.5-12.49-5.6-12.49-12.5,5.59-12.5,12.49-12.5M312.2,126c-20.12,0-36.49,16.37-36.49,36.5s16.37,36.5,36.49,36.5,36.49-16.37,36.49-36.5-16.37-36.5-36.49-36.5h0Z"/></svg>',
        [
            ['#ffcb0e', '#f5e70c', '#f0ea22', '#c0d62f', '#FFFFFF'],
            ['#89c541', '#46b749', '#24af4b', '#2ab567', '#D3D3D3'],
            ['#10a1c5', '#197fbe', '#1c60ad', '#294b9f', '#808080'],
            ['#263a94', '#373491', '#613191', '#9f3c96', '#555555'],
            ['#c21b79', '#e71b4c', '#ed2227', '#ee3824', '#333333'],
            ['#f26324', '#f57a20', '#f79020', '#faac1a', '#000000'],
        ],
    ),
    MIME_TYPES: [
        {
            label: 'Png',
            value: 'image/png',
        },
        {
            label: 'Jpeg',
            value: 'image/jpg',
        },
        {
            label: 'Gif',
            value: 'image/gif',
        },
    ],
    TEXT: new UiText(3, 50),
    TABS: [
        {
            id: 0,
            label: 'Image',
        },
        {
            id: 1,
            label: 'Text',
        },
        {
            id: 2,
            label: 'Saved',
        },
    ],
});
