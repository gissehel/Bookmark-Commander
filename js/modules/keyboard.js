const keyboard = {};


keyboard.init = () => {
    window.addEventListener('keydown', keyboard.onKeyDown);
    window.addEventListener('keyup', keyboard.onKeyUp);
}

keyboard.onKeyDown = async (event) => {
    if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt') {
        return;
    }

    let code = event.code;
    let key = event.key;
    if (event.altKey) {
        key = 'Alt+' + key;
        code = 'Alt+' + code;
    }
    if (event.shiftKey) {
        code = 'Shift+' + code;
    }
    if (event.ctrlKey) {
        key = 'Ctrl+' + key;
        code = 'Ctrl+' + code;
    }

    if (keyboard.escape && code !== 'Escape') {
        if (keyboard.escape_mapping[key]) {
            key = keyboard.escape_mapping[key];
        } else if (keyboard.escape_mapping[code]) {
            code = keyboard.escape_mapping[code];
        }
    }

    if (event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt') {
        keyboard.escape = (code === 'Escape');
    }

    if (keyboard.key_mapping[code]) {
        event.preventDefault();
        event.stopPropagation();
        await delay(1);
        keyboard.key_mapping[code](event);
    } else if (keyboard.key_mapping[key]) {
        event.preventDefault();
        event.stopPropagation();
        await delay(1);
        keyboard.key_mapping[key](event);
    }
};

keyboard.onKeyUp = (event) => {
    if (commander.editing) {
        editor.considerTextAreas();
    }
};

keyboard.addMapping = (obj) => {
    const builder = new KeyboardMappingBuilder();
    obj.key_mapping_builder = builder;
    return builder;
};

keyboard.escape_mapping = {};

[...'123456789'].forEach(c => {
    keyboard.escape_mapping[`Digit${c}`] = `F${c}`;
    keyboard.escape_mapping[c] = `F${c}`;
})
keyboard.escape_mapping['Digit0'] = 'F10';
keyboard.escape_mapping['0'] = 'F10';
