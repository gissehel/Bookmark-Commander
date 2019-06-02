/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/
const commander = {};

commander.left = { id: "1", selected: 0, scroll: 0, active: true, prefix: "left", info: false };
commander.right = { id: "2", selected: 0, scroll: 0, active: false, prefix: "rite", info: false };
commander.left.other = commander.right;
commander.right.other = commander.left;
commander.bookmarks = {};
commander.viewing = false;
commander.editing = false;
commander.manifest = null;


/****
 **
 * Regular panel
 **
 ****/

/* INIT, RE-INIT */
commander.init = () => commander.initOrReInit();

commander.reInit = () => commander.initOrReInit();

commander.initOrReInit = () => {
    chrome.bookmarks.getTree((stuff) => {
        commander.bookmarks = stuff;
        commander.draw();
    });
}

commander.getActivePanel = () => commander.left.active ? commander.left : commander.right;
commander.getInactivePanel = () => !commander.left.active ? commander.left : commander.right;

/* HELPER, DRAW IT */
commander.draw = () => {
    if (commander.left.id == "search") {
        chrome.bookmarks.search(commander.query, (o) => {
            commander.results = o;
            commander.setPanel(commander.left);
            commander.setPanel(commander.right);
            //mouse.init();
        });
        return;
    }

    //First draw the active one
    const panel = commander.getActivePanel();
    commander.setPanel(panel);
    commander.setPanel(panel.other);
    //mouse.init();
}

/* Core wild magic */
commander.setPanel = (panelConfig) => {
    //Show we be here ?
    if (panelConfig.info) {
        return commander.setInfoPanel(panelConfig);
    }

    let o = findBookmarkId(commander.bookmarks, panelConfig.id);

    //Deal with trouble
    if (!o || !o.children) {
        //If we are looking at a dead folder by any chance, just go to the root
        if (panelConfig.id != "0") {
            panelConfig.id = "0";
            commander.setPanel(panelConfig);
            return;
        } else {
            //This should never happen as well
            alert("Orthodox Bookmark Manager regrets to inform you that it cannot display your bookmarks,\n please hit refresh and try again.");
        }
    }

    //Set the folder structure on top
    const title = findBookmarkTitle(panelConfig.id);
    console.log({title});

    // dualPanel[panelConfig.prefix].root.innerText = "╔" + (title + data.doubleBar.repeat(data.panelWidth)).left(data.panelWidth) + "╗";
    dualPanel.setRootText(panelConfig.prefix, title, panelConfig.active);

    //Clear out the children
    for (let counter = 0; counter < data.panelHeight; counter++) {
        const line = dualPanel[panelConfig.prefix].lines[counter];
        if (line) {
            line.innerText = (" ".repeat(data.panelWidth));
            line.classList.remove("selected");
        }
    }

    //We merely do this to facilitate the following trick
    const children = [].concat(filterBookmarks(o.children, panelConfig.filter));

    //Do we have a parent ?, if so top the entries with '..'
    if (o.parentId) {
        children.reverse();
        children.push({ children: true, title: "..", id: o.parentId });
        children.reverse();
    }

    //Other parties are interested in how many items there really are
    panelConfig.itemCount = children.length;

    //Keep counter post-loop for sanity checks
    let counter;

    //Delete any reference to selectedBookmark, it might just go wrong with the info panel
    delete panelConfig.selectedBookmark;

    //Go over the children ( folders + bookmarks )
    for (counter = 0; counter < data.panelHeight && counter + panelConfig.scroll < children.length; counter++) {
        //Get the child
        let child = children[counter + panelConfig.scroll];
        //Default bookmark prefix and style
        let prefix = " ";
        let isJs = false;
        let isSelected = false;

        //This should never happen ™
        if (!child) {
            child = { url: '', title: '' }
        }

        //If there are no children though, take out the slash
        if (child.children) {
            prefix = "/";
        }

        //Are we dealing with a tree ? Then we have a slightly more complicated prefix
        if (panelConfig.id == "tree") {
            if (!child.depth & child.depth !== 0) {
                prefix = "!ERROR(no depth)"
            } else if (child.depth === 0) {
                prefix = "/"
            } else {
                prefix = " ".repeat(child.depth - 2) + "|-"
            }
        }

        //Are we looking at a javascript ?
        if (child.url && child.url.startsWith("javascript")) {
            isJs = true;
        }
        //If we look at the selected one the style is different
        if (counter == panelConfig.selected && panelConfig.active) {
            isSelected = true;
            //Lets also show the url
            if (child.url) {
                let url = child.url.left(((data.panelWidth + 1) * 2)).extend((data.panelWidth + 1) * 2);
                dualPanel.url.innerText = url;
            } else if (panelConfig.id == "tree") {
                let url = findBookmarkTitle(child.id).left(((data.panelWidth + 1) * 2)).extend((data.panelWidth + 1) * 2);
                dualPanel.url.innerText = url;
            } else {
                dualPanel.url.innerText = " ".repeat((data.panelWidth + 1) * 2);
            }
            panelConfig.selectedBookmark = child.id;
        }

        //Get the element
        const element = dualPanel[panelConfig.prefix].lines[counter];

        //set the style
        if (isJs) {
            element.classList.add('js');
        } else {
            element.classList.remove('js');
        }
        if (isSelected) {
            element.classList.add('selected');
        } else {
            element.classList.remove('selected');
        }

        //Set the content
        let innerHTML = (prefix + child.title).extend(data.panelWidth);

        //Highlight filter if any
        if (panelConfig.filter) {
            innerHTML = innerHTML.replaceAll(panelConfig.filter, "\u2604");
            innerHTML = innerHTML.replaceAll("\u2604", "<span class='paars'>" + panelConfig.filter + "</span>");
        }

        //Highlight filter if any
        if (panelConfig.selector) {
            if ((innerHTML.has(panelConfig.selector) || panelConfig.selector == "*") && child.title != "..") {
                innerHTML = "<span class='yellow'>" + innerHTML + "</span>";
            }
        }

        //Set the final innerHTML only now to prevent potential flickering
        element.innerHTML = innerHTML

        //Set the new index
        element.commander = { id: child.id };
    }

    //Since speed is of no concern, I just redraw the screen if we missed the selected item due to deletion ;)
    if (panelConfig.selected >= counter) {
        commander.end();
    }
}

/****
 **
 * Info panel
 **
 ****/
commander.setInfoPanel = (panelConfig) => {
    const o = findBookmarkId(commander.bookmarks, panelConfig.other.selectedBookmark);

    //Deal with trouble
    if (!o) {
        //If we are looking at a dead folder by any chance, just go to the root
        if (panelConfig.id != "0") {
            panelConfig.id = "0";
            commander.setPanel(panelConfig);
            return;
        }
        else {
            //This should never happen as well, except if we are in the menu ( other panel is inactive as well )
            if (!panelConfig.other.active) {
                return;
            } else {
                alert("Orthodox Bookmark Manager regrets to inform you that it cannot display the info on this bookmark,\n please hit refresh and try again.");
            }
        }
    }

    //Do not set the folder structure on top
    // dualPanel[panelConfig.prefix].root.innerText = "╔" + data.doubleBar.repeat(data.panelWidth) + "╗";
    dualPanel.setRootText(panelConfig.prefix, null, panelConfig.active);

    //Clear out the children
    for (let counter = 0; counter < data.panelHeight; counter++) {
        const line = dualPanel[panelConfig.prefix].lines[counter];
        if (line) {
            line.innerText = (" ".repeat(data.panelWidth));
            line.classList.remove('selected');
        }
    }

    //Deal with root, put some arbitrary value
    if (o.id == "0") {
        o.title = "root";
        o.index = 0;
        o.parentId = 0;
    }

    let line = 0;

    const lines = dualPanel[panelConfig.prefix].lines;
    let element = lines[line++];

    if (o.title) {
        element.innerHTML = (o.title).extend(data.panelWidth);
    }

    line++;

    if (o.dateAdded) {
        element = lines[line++];
        let d = new Date()
        d.setTime(o.dateAdded);
        element.innerHTML = ("  added:    " + d.format()).extend(data.panelWidth);
    }

    if (o.dateGroupModified) {
        element = lines[line++];
        let d = new Date()
        d.setTime(o.dateGroupModified);
        element.innerHTML = ("  changed:  " + d.format()).extend(data.panelWidth);
    }

    element = lines[line++];
    element.innerHTML = ("  id:       " + o.id).extend(data.panelWidth);

    element = lines[line++];
    element.innerHTML = ("  index:    " + o.index).extend(data.panelWidth);

    element = lines[line++];
    element.innerHTML = ("  parent:   " + o.parentId).extend(data.panelWidth);

    element = lines[line++];
    if (o.children) {
        element.innerHTML = ("  children: " + o.children.length).extend(data.panelWidth);
    } else {
        //Sugar
        let url = o.url;

        while (url.length > data.panelWidth) {
            //Get the victim, leave implicit space for first entry
            element = lines[line++];
            //content
            element.innerHTML = url.left(data.panelWidth);
            //remainder
            url = url.substring(data.panelWidth);
        }
        if (url.length > 0) {
            //Get the victim
            element = lines[line++];
            //content
            element.innerHTML = url.extend(data.panelWidth);
        }
    }
}

/* TAB, SWAP */
commander.swapPanel = () => {
    let panel = commander.getActivePanel();
    //Dont make an info panel active
    if (panel.other.info) {
        return;
    }

    commander.left.active = !commander.left.active;
    commander.right.active = !commander.right.active;
    commander.draw();
}

commander.swapPanels = () => {
    const temp = commander.left;
    commander.left = commander.right;
    commander.right = temp;

    //This is unfortunate, a 'clever' hack bleeding thru
    commander.left.prefix = "left";
    commander.right.prefix = "rite";
}

/* Prelude to SELECT, ENTER */
commander.delve = () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderId(panel.prefix, panel.selected);

    if (panel.id != "tree") {
        return commander.select(id);
    }

    //So, we are dealing with a tree
    commander.left.active = !commander.left.active;
    commander.right.active = !commander.right.active;
    panel.other.info = false;
    panel.other.id = id;
    commander.select(id);

}

/* SELECT, ENTER */
commander.select = (index) => {
    const panel = commander.getActivePanel();

    //Do we want to select this for real ?
    const bookmark = findBookmarkId(commander.bookmarks, index);

    //Go deeper if its a folder, or as the case may be, higher
    if (bookmark.children) {
        let nextSelected = 0;
        bookmark.children.map(child => child.id).forEach((id, pos) => { if (panel.id === id) { nextSelected = pos + (index === "0" ? 0 : 1); } });
        panel.id = index;
        panel.selected = nextSelected;
        panel.scroll = 0;
        panel.selector = "";
        commander.draw();
    } else if (bookmark.url && bookmark.url.startsWith(["http", "file"])) {
        //Open if its a bookmark
        chrome.tabs.getCurrent((tab) => chrome.tabs.create({ 'url': bookmark.url, 'index': tab.index }, null));
    }
    //Yes, do nuttin if its js, them evil hackers cannought be trusted
}

/* HELP */
commander.help = () => {
    chrome.tabs.create({ 'url': chrome.extension.getURL('help.html') }, null);
}

/* QUIT */
commander.quit = () => {
    if (commander.left.id == "search") {
        delete commander.query;
        delete commander.results;
        commander.back();
    } else {
        chrome.tabs.getCurrent((tab) => { chrome.tabs.remove(tab.id) });
    }
}

/* VIEW */
commander.view = () => {
    commander.viewing = !commander.viewing;

    if (commander.viewing) {
        dualPanel.hide();

        const panel = commander.getActivePanel();
        const id = dualPanel.getCommanderId(panel.prefix, panel.selected);

        if (id != "0") {
            viewer.view(id);
        } else {
            commander.viewing = false;
        }
    } else {
        dualPanel.show();
        viewer.remove();

        //we require it for decorating the elements, kludgy, I know
        commander.draw();

        commander.context.activate();
    }
}

/* EDIT */
commander.edit = () => {
    dualPanel.hide();

    const panel = commander.getActivePanel();

    if (panel.id == 0) {
        return;
    }

    const id = dualPanel.getCommanderId(panel.prefix, panel.selected);

    if (id != "0") {
        commander.editing = true;
        editor.view(id);
    }
}

/* MENU */
commander.menu = () => {
    [...document.getElementsByClassName('selected')].forEach(element => element.classList.remove('selected'));
    menu.context.activate();
    menu.show();
}

/* BACKSPACE */
commander.back = () => {
    const panel = commander.getActivePanel();

    if (panel.id == "search") {
        return commander.select("0");
    }
    
    const text = dualPanel.getLineText(panel.prefix, 0);

    if (text == "/..") {
        commander.select(dualPanel.getCommanderId(panel.prefix, 0));
    }
}

/* DOWN */
commander.down = () => {
    const panel = commander.getActivePanel();

    if (panel.selected == data.panelHeight - 1) {
        panel.scroll++;
    } else {
        panel.selected++;
    }

    if (!(panel.scroll + panel.selected < panel.itemCount)) {
        return commander.end();
    }

    commander.draw();
}

/* PAGE DOWN */
commander.pageDown = () => {
    const panel = commander.getActivePanel();

    if (panel.selected < data.panelHeight - 1) {
        panel.selected = data.panelHeight - 1;
    } else {
        panel.scroll = panel.scroll + data.panelHeight - 1;
    }

    if (!(panel.scroll + panel.selected < panel.itemCount)) {
        return commander.end();
    }

    commander.draw();
}


/* UP */
commander.up = () => {
    //Get active panel
    const panel = commander.getActivePanel();
    //if we are already physically in slot 0, see if we can still scroll up
    //Otherwise go up a physical slot
    if (panel.selected == 0) {
        panel.scroll--;
    } else {
        panel.selected--;
    }

    //Sanity fix the scroll value
    if (panel.scroll == -1) {
        panel.scroll = 0
    }
    //Draw the commander again
    commander.draw();
}

/* PAGE UP */
commander.pageUp = () => {
    //Get active panel
    const panel = commander.getActivePanel();
    //if we are already physically in slot 0, see if we can still scroll up
    //Otherwise go up a physical slot
    if (panel.selected != 0) {
        panel.selected = 0;
    } else {
        panel.scroll = panel.scroll - data.panelHeight + 1;
    }

    //Sanity fix the scroll value
    if (panel.scroll < 0) {
        panel.scroll = 0
    }
    //Draw the commander again
    commander.draw();
}

/* HOME */
commander.home = () => {
    const panel = commander.getActivePanel();
    panel.selected = 0;
    panel.scroll = 0;
    commander.draw();
}

/* END */
commander.end = () => {
    const panel = commander.getActivePanel();

    if (panel.itemCount < data.panelHeight + 1) {
        panel.scroll = 0;
        panel.selected = panel.itemCount - 1;
    } else {
        panel.scroll = panel.itemCount - data.panelHeight;
        panel.selected = data.panelHeight - 1;
    }
    commander.draw();
}

/* COPY */
commander.copy = () => {
    const from = commander.getActivePanel();
    const to = commander.getInactivePanel();

    if (to.id == "0") {
        alert("Can not copy bookmarks into the root")
        return
    }

    if (to.id == "search") {
        alert("Can not copy bookmarks into search results")
        return false
    }

    if (to.id == "tree") {
        alert("Can not copy bookmarks into the tree")
        return false
    }

    //Are we copying a selection ?
    if (from.selector && from.selector != "") {
        return commander.copySelection(from, to);
    }

    //Copying from
    const from_id = dualPanel.getCommanderId(from.prefix, from.selected);
    const bookmark = findBookmarkId(commander.bookmarks, from_id);

    const newBookmark = { parentId: to.id };
    //Create the bookmark object
    if (bookmark.title) {
        newBookmark.title = bookmark.title;
    }
    if (bookmark.url) {
        newBookmark.url = bookmark.url;
    }

    chrome.bookmarks.create(newBookmark, commander.reInit);
}

/* COPY SELECTION */
commander.copySelection = (from, to) => {
    const o = findBookmarkId(commander.bookmarks, from.id);

    //Minimal paranoia
    if (!o || !o.children) {
        return
    }

    const children = [].concat(filterBookmarks(o.children, from.filter));

    for (let counter = 0; counter < children.length; counter++) {
        if (children[counter].url && children[counter].url.has(from.selector) || from.selector == "*") {
            let bookmark = children[counter];
            let newBookmark = { parentId: to.id };

            newBookmark.title = bookmark.title;
            if (bookmark.url) {
                newBookmark.url = bookmark.url;
            }
            chrome.bookmarks.create(newBookmark);
        }
    }

    commander.reInit();
}

/* MOVE */
commander.move = () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderId(panel.prefix, panel.selected);
    const bookmark = findBookmarkId(commander.bookmarks, id);

    const to = commander.getInactivePanel();

    if (to.id == "0") {
        alert("Can not copy bookmarks into the root")
        return false
    }

    if (to.id == "search") {
        alert("Can not move bookmarks into search results")
        return false
    }

    if (to.id == "tree") {
        alert("Can not move bookmarks into the tree")
        return false
    }

    //Are we copying a selection ?
    if (panel.selector && panel.selector != "") {
        return commander.moveSelection(panel, to);
    }

    chrome.bookmarks.move(bookmark.id, { parentId: to.id }, commander.reInit);
}

/* MOVE SELECTION */
commander.moveSelection = (from, to) => {
    const o = findBookmarkId(commander.bookmarks, from.id);

    //Minimal paranoia
    if (!o || !o.children) {
        return
    }

    const children = [].concat(filterBookmarks(o.children, from.filter));

    for (let counter = 0; counter < children.length; counter++) {
        if (children[counter].url && children[counter].url.has(from.selector) || from.selector == "*") {
            const bookmark = children[counter];

            chrome.bookmarks.move(bookmark.id, { parentId: to.id }, commander.reInit);
        }
    }

    commander.reInit();
}

/* DELETE */
commander.delete = () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderId(panel.prefix, panel.selected);
    const bookmark = findBookmarkId(commander.bookmarks, id);

    //Are we copying a selection ?
    if (panel.selector && panel.selector != "") {
        return commander.deleteSelection(panel);
    }

    //What is interesting, is that removeTree works on non-trees as well
    //I am not going to count on that though ;]
    if (bookmark.children) {
        chrome.bookmarks.removeTree(bookmark.id, commander.reInit);
    } else {
        chrome.bookmarks.remove(bookmark.id, commander.reInit);
    }
}

/* DELETE SELECTION */
commander.deleteSelection = (from) => {
    const o = findBookmarkId(commander.bookmarks, from.id);

    //Minimal paranoia
    if (!o || !o.children) {
        return
    }

    const children = [].concat(filterBookmarks(o.children, from.filter));

    for (let counter = 0; counter < children.length; counter++) {
        if (children[counter].url && children[counter].url.has(from.selector) || from.selector == "*") {
            const bookmark = children[counter];
            //What is interesting, is that removeTree works on non-trees as well
            //I am not going to count on that though ;]
            if (bookmark.children) {
                chrome.bookmarks.removeTree(bookmark.id, commander.reInit);
            } else {
                chrome.bookmarks.remove(bookmark.id, commander.reInit);
            }
        }
    }
    commander.reInit();
}


/* CREATE FOLDER */
commander.createFolder = () => {
    const panel = commander.getActivePanel();
    const folderText = prompt("Enter folder name", "");

    if (folderText) {
        const newBookmark = { parentId: panel.id, title: folderText };
        chrome.bookmarks.create(newBookmark, (newItem) => {
            chrome.bookmarks.getTree((bookmarks) => {
                commander.bookmarks = bookmarks;
                const bookmark = findBookmarkId(bookmarks, panel.id);
                let nextSelected = null;
                bookmark.children.map(child => child.id).forEach((id, pos) => {
                    if (id === newItem.id) {
                        nextSelected = pos + (panel.id === "0" ? 0 : 1);
                    }
                });
                if (nextSelected !== null) {
                    panel.selected = nextSelected;
                    panel.scroll = 0;
                    panel.selector = "";
                }
                commander.draw();
            });
        });
    }
}

/* EQUALIZE */
commander.equalize = () => {
    const active = commander.getActivePanel();
    const sleepy = commander.getInactivePanel();

    sleepy.id = active.id;
    sleepy.selected = 0;
    sleepy.scroll = 0;

    commander.draw();
}

/* PLUS , MOVE UP */
commander.moveUp = () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderId(panel.prefix, panel.selected);
    const bookmark = findBookmarkId(commander.bookmarks, id);

    if (panel.id == 0) {
        return;
    }

    if (panel.selected == 0 && panel.scroll == 0) {
        return;
    }

    if (bookmark.index == 0) {
        return;
    }

    if (panel.selected == 0) {
        panel.scroll--;
    } else {
        panel.selected--;
    }

    chrome.bookmarks.move(id, { parentId: panel.id, index: (bookmark.index - 1) }, commander.reInit);

}

/* DOWN, MOVE DOWN */
commander.moveDown = () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderId(panel.prefix, panel.selected);
    let bookmark = findBookmarkId(commander.bookmarks, id);

    if (panel.id == 0) {
        return;
    }

    if (panel.selected == 0 && panel.scroll == 0) {
        return;
    }

    //now see who is under their
    const parent = findBookmarkId(commander.bookmarks, panel.id);
    bookmark = parent.children[bookmark.index + 1];
    if (bookmark) {
        //We are evilly counting on the 'hmmm I think this got deleted feature', muhaha is in order
        if (panel.selected == data.panelHeight - 1) {
            panel.scroll++;
        } else {
            panel.selected++;
        }

        chrome.bookmarks.move(bookmark.id, { parentId: panel.id, index: (bookmark.index - 1) }, commander.reInit);
    }
}

/* SEARCH */
commander.search = (searchText) => {
    delay(1).then(() => {
        if (!searchText) {
            if (commander.query) {
                searchText = commander.query;
            } else {
                searchText = prompt("Enter search string", ""); //"" is the default
            }
        }
        if (searchText) {
            chrome.bookmarks.search(searchText, (o) => {
                const panel = commander.getActivePanel();
                panel.id = "search";
                commander.results = o;
                commander.query = searchText;
                commander.draw();
            });
        }
    });
}

/* FILTER */
commander.filter = (panel) => {
    if (!panel) {
        panel = commander.getActivePanel();
    }

    panel.filter = prompt("Enter filter string", panel.filter); //"" is the default

    panel.filter.remove("*");

    commander.draw();
}

/* SELECT */
commander.selector = (panel) => {
    //Panel will actually be an event when called via the '*' key
    if (panel instanceof KeyboardEvent) {
        panel = commander.getActivePanel();
    }

    if (!panel.selector) {
        panel.selector = "*";
    } else if (panel.selector == "*") {
        panel.selector = "";
    }

    panel.selector = prompt("Select", panel.selector); //"" is the default

    commander.draw();
}

commander.setInfo = (panel) => {
    panel.other.info = false;
    panel.other.active = true;
    panel.info = true;
    panel.active = false;
}

commander.setList = (panel) => {
    panel.info = false;

    if (panel.id == "tree") {
        const id = dualPanel.getCommanderId(panel.prefix, panel.selected);
        commander.select(id);
    }
}

commander.setTree = (panel) => {
    panel.info = false;
    panel.id = "tree"
}

commander.sortBookmarksByDate = (panel, ctrlKey) => sortBookmarks(panel.id, null, sortByDateFunction, ctrlKey)
commander.sortBookmarksAlphabetically = (panel, ctrlKey) => sortBookmarks(panel.id, null, sortByNameFunction, ctrlKey)
commander.sortBookmarksByLength = (panel, ctrlKey) => sortBookmarks(panel.id, null, sortByLengthFunction, ctrlKey)

commander.getVersion = () => (commander.manifest && commander.manifest.version) || '...';

commander.about = () => options.show('about');


commander.onLeftClick = (n) => {
    menu.exitIfOut();
    if (data.simpleClickOnSelectedItemToActivate && commander.left.active && commander.left.selected == n) {
        commander.delve();
    } else {
        commander.left.info = false;
        commander.left.active = true;
        commander.right.active = false;
        commander.left.selected = n;
        commander.draw();
    }
}

commander.onRightClick = (n) => {
    menu.exitIfOut();
    if (data.simpleClickOnSelectedItemToActivate && commander.right.active && commander.right.selected == n) {
        commander.delve();
    } else {
        commander.right.info = false;
        commander.right.active = true;
        commander.left.active = false;
        commander.right.selected = n;
        commander.draw();
    }
}

commander.onLeftDoubleClick = (n) => {
    menu.exitIfOut();
    commander.left.info = false;
    commander.left.active = true;
    commander.right.active = false;
    commander.left.selected = n;
    commander.draw();
    commander.delve();
}

commander.onRightDoubleClick = (n) => {
    menu.exitIfOut();
    commander.right.info = false;
    commander.right.active = true;
    commander.left.active = false;
    commander.right.selected = n;
    commander.draw();
    commander.delve();
}

fetch('./manifest.json')
    .then((response) => {
        if (response.status != 200) {
            throw new Error(`No 200 status : [${response.status}]`);
        };
        return response.json();
    })
    .then((manifest) => commander.manifest = manifest)

