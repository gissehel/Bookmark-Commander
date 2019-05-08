/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

const menu = {};

{
    //Nuts about parsing
    menu.itemize = (indent, s) => {
        //Skeleton object
        const o = { maxText: 0, maxKey: 0, maxKeyText: 0 };
        //Split out the parameter into menu items
        const ta = s.split(",")
        //Go over each menu item
        for (key in ta) {
            //Init
            o[key] = {};
            //Split text and key
            const textkey = ta[key].split("|")
            //Set text, no risk
            o[key].text = textkey[0];
            //Is this the longest one so far ?
            if (o[key].text.length > o.maxText) {
                o.maxText = o[key].text.length;
            }
            //Assume we have no key
            o[key].key = "";
            //Do we have a key ? Assign and measure
            if (textkey[1]) {
                //Assign
                o[key].key = textkey[1];
                //Measure
                if (o[key].key.length > o.maxKeyText) {
                    o.maxKeyText = o[key].key.length;
                }
            }
            //See if we have a shortcut by splitting
            const prepost = o[key].text.split("&")
            //Do we have a shortcut
            if (prepost.length == 2) {
                //Deal with the shortcut
                o[key].html = prepost[0] + "<span class='speed'>" + prepost[1].left(1) + "</span>" + prepost[1].substring(1);
            } else {
                //Or dont deal with it
                o[key].html = o[key].text.remove("&");
            }
            //Finally, remove the pesky & from the text
            o[key].text = o[key].text.remove("&")
            //Remember the key
            o.maxKey = key;
        }

        for (key in ta) {
            //Put some indenting in place and finalize the box
            o[key].html = "<hidden>" + "X".repeat(indent) + "</hidden><span class='menu'>║</span><span class='menu' id='" + key + "'> " + o[key].html + " ".repeat(o.maxText - o[key].text.length) + o[key].key + " ".repeat(o.maxKeyText - o[key].key.length) + "</span><span class='menu'>║</span>\n";
        }

        return o;
    }

    const fontSizes = [...Array(11).keys()].map(x => 10 + x);
    const fontSizesText = fontSizes.map(size => [`${size}px`, size]);
    const fontSizesInMenu = fontSizesText.map(x => x[0]).join(',');
    const fontSizesChange = pairToObject(fontSizesText.map(([label, size]) => [label, () => dataAccess.setSize(size)]));
    const assignLeftRights = (menus) => {
        const len = menus.length;
        for(let index = 0; index<len; index++) {
            leftIndex = (index+len-1)%len;
            rightIndex = (index+1)%len;
            menus[index].left = menus[leftIndex];
            menus[index].right = menus[rightIndex];
        }
    }

    menu.init = () => {
        menu.dropdown = document.getElementById("dropdown")

        //Each menu is an object
        //Bad violation of DRY, but its worth not rewriting this.
        menu.left = { caption: "Left", indent: 1, items: menu.itemize(1, "&List,&Info,&Tree,_,Sort by &Date,&Sort by Length,Sort &Alphabetically,_,&Filter|/,Select|*,_,&Rescan|C-r") };
        menu.file = { caption: "File", indent: 11, items: menu.itemize(11, "&Help|F1,Mirror|F2,View|F3,Edit|F4,Copy|F5,Move|F6,Create Folder |F7,Delete|F8,Quit|F10,_,Move up|+,Move down|-,Select|*,Filter|/") };
        menu.command = { caption: "Command", indent: 20, items: menu.itemize(20, "&Search,S&wap panels") };
        menu.options = { caption: "Options", indent: 32, items: menu.itemize(32, /* "&Options,_," + */ fontSizesInMenu) };
        menu.right = { caption: "Right", indent: 44, items: menu.itemize(44, "&List,&Info,&Tree,_,Sort by &Date,&Sort by Length,Sort &Alphabetically,_,&Filter|/,Select|*,_,&Rescan|C-r") };

        assignLeftRights([menu.left, menu.file, menu.command, menu.options, menu.right]);

        menu.current = menu.left;

        menu.selection = 0;
    }

    menu.show = () => {
        /* This could be ruined */
        menu.dropdown = document.getElementById("dropdown")

        //We are filling in a pre
        let s = "<pre id='currentMenu' style='margin: 0px 0px 0px 0px'>\n\n";

        //We need the top, and it needs to be indented
        s = s + "<hidden>" + "X".repeat(menu.current.indent) + "</hidden>";
        //The top
        s = s + "<span class='menu'>╔" + data.doubleBar.repeat(menu.current.items.maxText + menu.current.items.maxKeyText + 1) + "╗</span>\n";

        for (key = 0; key <= menu.current.items.maxKey; key++) {
            if (menu.current.items[key].text == "_") {
                s = s + "<hidden>" + "X".repeat(menu.current.indent) + "</hidden>" + "<span class='menu'>╠" + data.doubleBar.repeat(menu.current.items.maxText + menu.current.items.maxKeyText + 1) + "╣</span>\n";
            } else {
                s = s + menu.current.items[key].html;
            }
        }

        //We need the bottom, and it needs to be indented
        s = s + "<hidden>" + "X".repeat(menu.current.indent) + "</hidden>";
        //The bottom
        s = s + "<span class='menu'>╚" + data.doubleBar.repeat(menu.current.items.maxText + menu.current.items.maxKeyText + 1) + "╝</span>\n";
        //Close
        s = s + "</pre>";

        //Set it
        menu.dropdown.innerHTML = s;
        //Show it
        menu.dropdown.style.display = "block"

        //Color the name of the menu
        $('.menuItem').removeClass('fcode');
        $('#menu_'+menu.current.caption).addClass('fcode');

        //Highlight the selected menu entry
        $('#' + menu.selection).removeClass('menu').addClass('fcode');
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
            if (menuItem.text == "_") {
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
            if (menuItem.text == "_") {
                menu.goUp();
            }
        } else {
            menu.selection = menu.current.items.maxKey;
        }
        menu.show();
    }

    menu.exit = () => {
        document.getElementById("dropdown").style.display = "none"
        $('.menuItem').removeClass('fcode');

        commander.reinit();
        commander.key_mapping_builder.activate();
    }

    menu.exit_if_out = () => {
        if (menu.dropdown.style.display == "block")
        {
            menu.exit();
        }
    }

    menu.dispatch = (event) => {
        const command = menuItem = menu.current.items[menu.selection].text;

        //We should always exit the menu
        //So no code required for Rescan since menu.exit rescans automatically
        menu.exit();

        //pre-work reduces rework
        const panel = (menu.current.caption == "Left") ? commander.left : commander.right;
        const id = (menu.current.caption == "Left") ? commander.left.id : commander.right.id;

        if (command == "Help") commander.help();
        if (command == "Mirror") commander.equalize();
        if (command == "View") commander.view();
        if (command == "Edit") commander.edit();
        if (command == "Copy") commander.copy();
        if (command == "Move") commander.move();
        if (command == "Create Folder ") commander.createFolder(); //Note the extra hacky space at the end ;\
        if (command == "Delete") commander.delete();       //Note the use of a keyword as a function ;\
        if (command == "Quit") commander.quit();
        if (command == "Move up") commander.moveUp();
        if (command == "Move Down") commander.moveDown();
        if (command == "Search") commander.search();

        if (command == "Sort by Date") sortBookmarks(id, null, sortByDateFunction, event.ctrlKey)
        if (command == "Sort Alphabetically") sortBookmarks(id, null, sortByNameFunction, event.ctrlKey)
        if (command == "Sort by Length") sortBookmarks(id, null, sortByLengthFunction, event.ctrlKey)

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
        commander.reinit();
    }
}