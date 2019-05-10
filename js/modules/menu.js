/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

const menu = {};

menu.getSubItem = (itemDescription) => {
    subItem = {};

    const textKey = itemDescription.split("|")

    const text = textKey[0];
    subItem.key = textKey[1] ? textKey[1] : "";

    const prePost = text.split("&")

    if (prePost.length == 2) {
        subItem.htmlName = prePost[0] + "<span class='speed'>" + prePost[1].left(1) + "</span>" + prePost[1].substring(1);
    } else {
        subItem.htmlName = text.remove("&");
    }

    subItem.text = text.remove("&")
    return subItem;
}

menu.itemize = (item) => {
    const { indent, itemsDescription } = item;

    item.items = itemsDescription.split(",").map(menu.getSubItem);

    let maxKeyText = Math.max(...item.items.map(subItem => subItem.key.length));
    let maxText = Math.max(...item.items.map(subItem => subItem.text.length));

    // const hidden = "<hidden>" + " ".repeat(indent) + "</hidden>";
    const hidden = '';

    item.items.forEach((subItem, subItemIndex) => {
        //Put some indenting in place and finalize the box
        if (subItem.text == "_") {
            subItem.html = `${hidden}<span class='menu'>╠${data.doubleBar.repeat(maxText + maxKeyText + 2)}╣</span>\n`;
            subItem.isSep = true;
        } else {
            subItem.html = `${hidden}<span class='menu'>║</span><span class='menu menuItem' id='menuItem_${subItemIndex}'> ${subItem.htmlName}${" ".repeat(maxText - subItem.text.length)}${subItem.key}${" ".repeat(maxKeyText + 1 - subItem.key.length)}</span><span class='menu'>║</span>\n`;
            subItem.isSep = false;
        }

    });

    item.menuStart = hidden + "<span class='menu'>╔" + data.doubleBar.repeat(maxText + maxKeyText + 2) + "╗</span>\n";
    item.menuStop = hidden + "<span class='menu'>╚" + data.doubleBar.repeat(maxText + maxKeyText + 2) + "╝</span>\n";

    item.maxKeyText = maxKeyText;
    item.maxText = maxText;
}

const fontSizes = [...Array(11).keys()].map(x => 10 + x);
const fontSizesText = fontSizes.map(size => [`${size}px`, size]);
const fontSizesInMenu = fontSizesText.map(x => x[0]).join(',');
const fontSizesChange = pairToObject(fontSizesText.map(([label, size]) => [label, () => dataAccess.setSize(size)]));

menu.assignLeftRights = () => {
    let { items } = menu;
    const len = items.length;
    for (let index = 0; index < len; index++) {
        leftIndex = (index + len - 1) % len;
        rightIndex = (index + 1) % len;
        items[index].left = items[leftIndex];
        items[index].right = items[rightIndex];
    }
}

menu.assignIndent = () => {
    let { items } = menu;
    let titleText = "";
    let titleHtml = "";

    items.forEach((item, itemIndex) => {
        item.indent = titleText.length + 1;

        titleHtml += ` <span class="topMenuItem" id="menu_${item.caption}" data-index='${itemIndex}'> ${item.caption} </span>  `;
        titleText += `  ${item.caption}   `;
    });

    menu.titleHtml = titleHtml;
    menu.titleText = titleText;
}

menu.init = () => {
    menu.dropdown = createElement('div', { id: 'dropdown' }, { appendTo: document.body });

    menu.assignIndent();
    menu.assignLeftRights();

    menu.items.forEach(item => menu.itemize(item));

    menu.current = menu.items[0];
    menu.selection = 0;

    menu.isOut = false;

    menu.refresh();
}

menu.refresh = () => {
    if (menu.titleHtml) {
        document.getElementById('menu').innerHTML = menu.titleHtml + ''.extend(data.screenWidth - menu.titleText.length);
    }
}

menu.show = () => {
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
        menuItem.classList.remove('menu');
        menuItem.classList.add('fcode');
    }

}

menu.goLeft = () => {
    menu.current = menu.current.left;
    menu.selection = 0;
    menu.show();
}

menu.goRight = () => {
    menu.current = menu.current.right;
    menu.selection = 0;
    menu.show();
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
    menu.show();
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
    menu.show();
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

menu.dispatch = ({ shiftKey, ctrlKey, altKey }) => {
    const command = menuItem = menu.current.items[menu.selection].text.trim(' ');

    //We should always exit the menu
    //So no code required for Rescan since menu.exit rescans automatically
    menu.exit();

    //pre-work reduces rework
    const panel = (menu.current.caption == "Left") ? commander.left : commander.right;
    const id = panel.id;

    if (command == "Help") commander.help();
    if (command == "Mirror") commander.equalize();
    if (command == "View") commander.view();
    if (command == "Edit") commander.edit();
    if (command == "Copy") commander.copy();
    if (command == "Move") commander.move();
    if (command == "Create Folder") commander.createFolder();
    if (command == "Delete") commander.delete();
    if (command == "Quit") commander.quit();
    if (command == "Move up") commander.moveUp();
    if (command == "Move Down") commander.moveDown();
    if (command == "Search") commander.search();

    if (command == "Sort by Date") sortBookmarks(id, null, sortByDateFunction, ctrlKey)
    if (command == "Sort Alphabetically") sortBookmarks(id, null, sortByNameFunction, ctrlKey)
    if (command == "Sort by Length") sortBookmarks(id, null, sortByLengthFunction, ctrlKey)

    if (command == "Info") {
        panel.other.info = false;
        panel.other.active = true;
        panel.info = true;
        panel.active = false;
    }

    if (command == "List") {
        panel.info = false;

        if (panel.id == "tree") {
            const id = document.getElementById(panel.prefix + panel.selected).commander.id;
            commander.select(id);
        }
    }

    if (command == "Swap panels") {
        const temp = commander.left;
        commander.left = commander.right;
        commander.right = temp;

        //This is unfortunate, a 'clever' hack bleeding thru
        commander.left.prefix = "left";
        commander.right.prefix = "rite";
    }

    /* Note the different calls according to File vs. Left/Right */
    if (command == "Filter") {
        if (menu.current.caption == "File") {
            commander.filter();
        } else {
            commander.filter(panel);
        }
    }

    if (command == "Select") {
        if (menu.current.caption == "File") {
            commander.selector();
        } else {
            commander.selector(panel);
        }
    }

    if (command == "Tree") {
        panel.info = false;
        panel.id = "tree"
    }

    if (command == "Options") {
        options.show();
    }
    if (fontSizesChange[command] !== undefined) {
        fontSizesChange[command]();
    }
    commander.reInit();
}

menu.items = [
    {
        caption: "Left",
        itemsDescription: "&List,&Info,&Tree,_,Sort by &Date,&Sort by Length,Sort &Alphabetically,_,&Filter|/,Select|*,_,&Rescan|C-r",
    },
    {
        caption: "File",
        itemsDescription: "&Help|F1,Mirror|F2,View|F3,Edit|F4,Copy|F5,Move|F6,Create Folder |F7,Delete|F8,Quit|F10,_,Move up|+,Move down|-,Select|*,Filter|/",
    },
    {
        caption: "Command",
        itemsDescription: "&Search,S&wap panels",
    },
    {
        caption: "Options",
        itemsDescription: fontSizesInMenu,
    },
    {
        caption: "Right",
        itemsDescription: "&List,&Info,&Tree,_,Sort by &Date,&Sort by Length,Sort &Alphabetically,_,&Filter|/,Select|*,_,&Rescan|C-r",
    }
];

