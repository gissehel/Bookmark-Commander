const keyboard = {};

keyboard.init = () => {
    window.addEventListener('keydown', (event) => {
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
            keyboard.key_mapping[code](event);
            event.preventDefault();
            event.stopPropagation();
        } else if (keyboard.key_mapping[key]) {
            keyboard.key_mapping[key](event);
            event.preventDefault();
            event.stopPropagation();
        }
    });

    window.addEventListener('keyup', (event) => {
        if (commander.editing) {
            editor.considerTextAreas();
        }
    });
}

keyboard.addMapping = (obj) => {
    const builder = new KeyboardMappingBuilder();
    obj.key_mapping_builder = builder;
    return builder;
}

keyboard.escape_mapping = {};

[...'123456789'].forEach(c => {
    keyboard.escape_mapping[`Digit${c}`] = `F${c}`;
    keyboard.escape_mapping[c] = `F${c}`;
})
keyboard.escape_mapping['Digit0'] = 'F10';
keyboard.escape_mapping['0'] = 'F10';
