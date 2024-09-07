import UiFolder from './models/Folder';

export const FOLDER = Object.freeze({
    ROOT: new UiFolder(
        'My Shortcuts Tab',
        'root',
        '1',
    ),
});

export const EMITS = Object.freeze({
    SAVE: 'save',
});
