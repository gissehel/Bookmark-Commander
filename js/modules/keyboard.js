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

    if (keyboard.keyMapping[code]) {
        keyboard.processKey(code, event);
    } else if (keyboard.keyMapping[key]) {
        keyboard.processKey(key, event);
    } else if (shortcutBar.keys.indexOf(key)>=0) {
        event.preventDefault();
        event.stopPropagation();
        shortcutBar.processShortcut(key);
    }
};

keyboard.processKey = async (name, event) => {
    if (keyboard.keyMapping[name]) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        await delay(1);
        keyboard.keyMapping[name](event);
    }
}

keyboard.onKeyUp = (event) => {
    if (commander.editing) {
        editor.considerTextAreas();
    }
};

keyboard.addMapping = () => new ContextBuilder();

keyboard.escape_mapping = {};

[...'123456789'].forEach(c => {
    keyboard.escape_mapping[`Digit${c}`] = `F${c}`;
    keyboard.escape_mapping[c] = `F${c}`;
})
keyboard.escape_mapping['Digit0'] = 'F10';
keyboard.escape_mapping['0'] = 'F10';
