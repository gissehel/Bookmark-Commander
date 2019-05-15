/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

const menu = {};

menu.formatSubItem = (itemData) => {
    subItem = {};

    if (itemData.isSep) {
        subItem.isSep = true;
    } else {
        const text = itemData.title;
        subItem.key = itemData.shortCut ? itemData.shortCut : "";

        const prePost = text.split("&")

        if (prePost.length == 2) {
            subItem.htmlName = prePost[0] + "<span class='speed'>" + prePost[1].left(1) + "</span>" + prePost[1].substring(1);
        } else {
            subItem.htmlName = text.remove("&");
        }

        subItem.text = text.remove("&");
        subItem.command = itemData.command;
    }

    return subItem;
}

menu.itemize = (item) => {
    const { itemsData } = item;

    item.items = itemsData.map(menu.formatSubItem);

    let maxKeyText = Math.max(...item.items.filter(subItem => !subItem.isSep).map(subItem => subItem.key.length));
    let maxText = Math.max(...item.items.filter(subItem => !subItem.isSep).map(subItem => subItem.text.length));

    if (maxKeyText === -Infinity) {
        maxKeyText = 0;
    }
    if (maxText === -Infinity) {
        maxText = 0;
    }
    if (maxKeyText > 0) {
        maxText += 1;
    }

    item.menuStart = "<span class='menu'>╔" + data.doubleBar.repeat(maxText + maxKeyText + 2) + "╗</span>\n";

    item.items.forEach((subItem, subItemIndex) => {
        if (subItem.isSep) {
            subItem.html = `<span class='menu'>╠${data.doubleBar.repeat(maxText + maxKeyText + 2)}╣</span>\n`;
        } else {
            subItem.html = `<span class='menu'>║</span><span class='menu menuItem' id='menuItem_${subItemIndex}' data-index='${subItemIndex}'> ${subItem.htmlName}${" ".repeat(maxText - subItem.text.length)}${subItem.key}${" ".repeat(maxKeyText + 1 - subItem.key.length)}</span><span class='menu'>║</span>\n`;
        }
    });

    item.menuStop = "<span class='menu'>╚" + data.doubleBar.repeat(maxText + maxKeyText + 2) + "╝</span>\n";

    item.maxKeyText = maxKeyText;
    item.maxText = maxText;
}

const fontSizes = [...Array(11).keys()].map(x => 10 + x);

menu.assignLeftRights = (definition) => {
    const len = definition.length;
    for (let index = 0; index < len; index++) {
        leftIndex = (index + len - 1) % len;
        rightIndex = (index + 1) % len;
        definition[index].left = definition[leftIndex];
        definition[index].right = definition[rightIndex];
    }
}

menu.assignIndent = (definition) => {
    let titleText = "";
    let titleHtml = "";

    definition.forEach((item, itemIndex) => {
        item.indent = titleText.length + 1;

        titleHtml += ` <span class="topMenuItem" id="menu_${item.caption}" data-index='${itemIndex}'> ${item.caption} </span>  `;
        titleText += `  ${item.caption}   `;
    });

    menu.titleHtml = titleHtml;
    menu.titleText = titleText;
}

menu.init = () => {
    menu.dropdown = createElement('div', { id: 'dropdown' }, { appendTo: document.body });

    const definition = menu.definition || [{caption:'None', itemsData:[{title:'None', command:()=>{}}]}];
    menu.definition = definition;

    menu.assignIndent(definition);
    menu.assignLeftRights(definition);

    definition.forEach(item => menu.itemize(item));

    menu.current = definition[0];
    menu.selection = 0;

    menu.isOut = false;

    menu.refresh();
}

menu.refresh = () => {
    if (menu.titleHtml) {
        document.getElementById('menu').innerHTML = menu.titleHtml + ''.extend(data.screenWidth - menu.titleText.length);
    }
}

menu.show = (n) => {
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

menu.select = (n) => {
    if (!menu.isOut) {
        return;
    }
    if (n !== undefined) {
        menu.selection = n;
    }
    const current = menu.current;
    [...document.getElementsByClassName('menuItem')].forEach(element => element.classList.remove('fcode'));

    const menuItem = document.getElementById('menuItem_' + menu.selection);
    if (menuItem) {
        menuItem.classList.add('fcode');
    }
}

menu.goLeft = () => {
    menu.current = menu.current.left;
    menu.show(0);
}

menu.goRight = () => {
    menu.current = menu.current.right;
    menu.show(0);
}

menu.goDown = () => {
    menu.selection++;
    if (menuItem = menu.current.items[menu.selection]) {
        if (menuItem.isSep) {
            menu.goDown();
        }
    } else {
        menu.selection = 0;
    }
    menu.select();
}

//Yes, this is an evil clone of goDown
//probably this should have been 1 function with an argument..
menu.goUp = () => {
    menu.selection--;
    if (menuItem = menu.current.items[menu.selection]) {
        if (menuItem.isSep) {
            menu.goUp();
        }
    } else {
        menu.selection = menu.current.items.length;
    }
    menu.select();
}

menu.exit = () => {
    menu.dropdown.classList.remove('on');
    menu.dropdown.classList.add('off');
    menu.isOut = false;
    [...document.getElementsByClassName('topMenuItem')].forEach(element => element.classList.remove('fcode'));
    [...document.getElementsByClassName('menuItem')].forEach(element => element.classList.remove('fcode'));

    commander.reInit();
    commander.key_mapping_builder.activate();
}

menu.exitIfOut = () => {
    if (menu.isOut) {
        menu.exit();
    }
}

menu.dispatch = ({ shiftKey, ctrlKey, altKey }, n) => {
    if (n !== undefined) {
        menu.selection = n;
    }
    const action = menuItem = menu.current.items[menu.selection].command;
    let panel;
    if (menu.current.getPanel) {
        panel = menu.current.getPanel();
    } else {
        panel = commander.getActivePanel();
    }
    if (action) {
        menu.exit();
        action({ panel, shiftKey, ctrlKey, altKey });
        commander.reInit();
        return;
    }
}

menu.setDefinition = (definition) => menu.definition = definition;

menu.open = (menuIndex) => {
    menu.current = menu.definition[menuIndex];
    menu.selection = 0;
    commander.menu();
}

menu.build = () => {
    if (menu._builder === undefined) {
        menu._builder = new MenuBuilder(menu);
    }
    return menu._builder;
}