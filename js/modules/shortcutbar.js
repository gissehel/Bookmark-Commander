const shortcutBar = {};

shortcutBar.init = () => {
    shortcutBar.dropdown = createElement('pre', { id: 'shortcutBar' }, { appendTo: document.body });

    shortcutBar.names = {};
    shortcutBar.shortcuts = {};

    shortcutBar.indexes = [...Array(10).keys()].map(x => x + 1);
    shortcutBar.keys = shortcutBar.indexes.map((index) => `F${index}` );

    shortcutBar.indexes.map((index) => {
        const shortcut = createElement('span', { className: 'shortcut', id: `shortcut-${index}` }, { appendTo: shortcutBar.dropdown });
        shortcut.setAttribute('data-index', index);
        shortcutBar.shortcuts[index] = shortcut;
        createElement('span', { className: 'fcode', innerText: `F${index}`.padStart(3, ' ') }, { appendTo: shortcut });
        shortcutBar.names[index] = createElement('span', { className: 'menu', innerText: "".padEnd(6, ' ') }, { appendTo: shortcut });
    })
    shortcutBar.statusEnd = createElement('span', { className: 'fcode' }, { appendTo: shortcutBar.dropdown });
    shortcutBar.statusWarning = createElement('span', { className: 'statusWarning' }, { appendTo: shortcutBar.statusEnd });

    shortcutBar.redraw();
}

shortcutBar.redraw = (message) => {
    if (!message) {
        message = ''
    }
    if (shortcutBar.statusWarning) {
        shortcutBar.statusWarning.innerText = message.padEnd(data.screenWidth - 90, ' ');
        shortcutBar.dropdown.style.width = data.screenWidth * data.calibreWidth;
        shortcutBar.dropdown.style.top = (data.screenHeight - 1) * data.calibreHeight;
    }
}

shortcutBar.processShortcut = (key) => {
    if (shortcutBar.current.byKeyName[key]) {
        shortcutBar.current.byKeyName[key].code();
    }
};


shortcutBar.setCurrent = (current) => {
    shortcutBar.current = current;
    
    shortcutBar.indexes.map((index) => {
        if (shortcutBar.current && shortcutBar.current.byIndex[index]) {
            shortcutBar.names[index].innerText = shortcutBar.current.byIndex[index].name.padEnd(6, ' ');
        } else {
            shortcutBar.names[index].innerText = ''.padEnd(6, ' ');
        }
    })
}

shortcutBar.show = (n) => {
    if (n !== undefined) {
        menu.selection = n;
    }
    const current = menu.current;

    menu.dropdown.innerHTML = sum([
        "<pre id='currentMenu'>\n\n",
        current.menuStart,
        ...current.items.map(subItem => subItem.html),
        current.menuStop,
        "</pre>",
    ]);

    menu.dropdown.style.left = current.indent * data.calibreWidth;

    menu.dropdown.classList.remove('off');
    menu.dropdown.classList.add('on');
    menu.isOut = true;

    //Color the name of the menu
    [...document.getElementsByClassName('menuItem')].forEach(element => element.classList.remove('fcode'));
    [...document.getElementsByClassName('topMenuItem')].forEach(element => element.classList.remove('fcode'));
    document.getElementById('menu_' + menu.current.caption).classList.add('fcode');

    //Highlight the selected menu entry
    const menuItem = document.getElementById('menuItem_' + menu.selection);
    if (menuItem) {
        menuItem.classList.add('fcode');
    }
}

