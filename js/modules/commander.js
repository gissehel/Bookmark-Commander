/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/
const commander = {};

commander.left = { id: "1", selected: 0, scroll: 0, active: true, prefix: "left", info: false };
commander.right = { id: "2", selected: 0, scroll: 0, active: false, prefix: "rite", info: false };
commander.left.other = commander.right;
commander.right.other = commander.left;
commander.viewing = false;
commander.editing = false;
commander.manifest = null;

/****
 **
 * Regular panel
 **
 ****/

/* INIT, RE-INIT */
commander.init = async () => {
    await commander.initOrReInit();
}

commander.reInit = async () => {
    await commander.initOrReInit();
}

commander.initOrReInit = async () => {
    await vfs.init();
    await commander.draw();
}

commander.getActivePanel = () => commander.left.active ? commander.left : commander.right;
commander.getInactivePanel = () => !commander.left.active ? commander.left : commander.right;

/* HELPER, DRAW IT */
commander.draw = async () => {
    if (commander.left.id == "search") {
        const result = await vfs.search(commander.query);
        commander.results = result;
        await commander.setPanel(commander.left);
        await commander.setPanel(commander.right);
        return;
    }

    //First draw the active one
    const panel = commander.getActivePanel();
    await commander.setPanel(panel);
    await commander.setPanel(panel.other);
    //mouse.init();
}

/* Core wild magic */
commander.setPanel = async (panelConfig) => {
    //Show we be here ?
    if (panelConfig.info) {
        return commander.setInfoPanel(panelConfig);
    }

    const bookmark = await vfs.findItemById(panelConfig.id);
    //Deal with trouble
    if (!bookmark || !bookmark.children) {
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
    const title = await vfs.getFullTitle(panelConfig.id);

    dualPanel.setRootText(panelConfig.prefix, title, panelConfig.active);

    //Clear out the children
    // dualPanel.panelIds.forEach((counter) => dualPanel.setLine(panelConfig.prefix, counter, '', {}));

    //We merely do this to facilitate the following trick
    const children = [...await vfs.filter(bookmark.children, panelConfig.filter)];

    //Do we have a parent ?, if so top the entries with '..'
    if (bookmark.parentId) {
        children.reverse();
        children.push({ children: true, title: "..", id: bookmark.parentId });
        children.reverse();
    }

    //Other parties are interested in how many items there really are
    panelConfig.itemCount = children.length;

    //Keep counter post-loop for sanity checks
    let counter;

    //Delete any reference to selectedBookmark, it might just go wrong with the info panel
    delete panelConfig.selectedBookmark;

    //Go over the children ( folders + bookmarks )
    dualPanel.panelIds.forEach(async (counter) => {
        if (counter + panelConfig.scroll < children.length) {
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
                    dualPanel.setUrl(child.url);
                } else if (panelConfig.id == "tree") {
                    const title = await vfs.getFullTitle(child.id);
                    dualPanel.setUrl(title);
                } else {
                    dualPanel.setUrl('');
                }
                panelConfig.selectedBookmark = child.id;
            }

            dualPanel.setLine(panelConfig.prefix, counter, prefix + child.title, {
                isJs,
                isSelected,
                id: child.id,
                filter: panelConfig.filter,
                highlighted: panelConfig.selector && ((child.title.has(panelConfig.selector) || panelConfig.selector == "*") && child.title != ".."),
            });
        } else {
            dualPanel.setLine(panelConfig.prefix, counter, '', {});
        }
    });

    //Since speed is of no concern, I just redraw the screen if we missed the selected item due to deletion ;)
    if (panelConfig.selected >= Math.min(children.length - panelConfig.scroll, data.panelHeight)) {
        await commander.end();
    }

}

/****
 **
 * Info panel
 **
 ****/
commander.setInfoPanel = async (panelConfig) => {
    const bookmark = await vfs.findItemById(panelConfig.other.selectedBookmark)

    //Deal with trouble
    if (!bookmark) {
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
    dualPanel.setRootText(panelConfig.prefix, null, panelConfig.active);

    //Clear out the children
    dualPanel.panelIds.forEach((counter) => dualPanel.setLine(panelConfig.prefix, counter, '', {}));

    //Deal with root, put some arbitrary value
    if (bookmark.id == "0") {
        bookmark.title = "root";
        bookmark.index = 0;
        bookmark.parentId = 0;
    }

    let line = 0;

    if (bookmark.title) {
        dualPanel.setLine(panelConfig.prefix, line, bookmark.title, {});
    }

    line++;
    line++;

    if (bookmark.dateAdded) {
        let d = new Date()
        d.setTime(bookmark.dateAdded);
        dualPanel.setLine(panelConfig.prefix, line++, "  added:    " + d.format(), {});
    }

    if (bookmark.dateGroupModified) {
        let d = new Date()
        d.setTime(bookmark.dateGroupModified);
        dualPanel.setLine(panelConfig.prefix, line++, "  changed:  " + d.format(), {});
    }

    dualPanel.setLine(panelConfig.prefix, line++, "  id:       " + bookmark.id, {});
    dualPanel.setLine(panelConfig.prefix, line++, "  index:    " + bookmark.index, {});
    dualPanel.setLine(panelConfig.prefix, line++, "  parent:   " + bookmark.parentId, {});

    if (bookmark.children) {
        dualPanel.setLine(panelConfig.prefix, line++, "  children: " + bookmark.children.length, {});
    } else {
        //Sugar
        let url = bookmark.url;

        dualPanel.setLine(panelConfig.prefix, line++, '', {});

        while (url.length > data.panelWidth) {
            dualPanel.setLine(panelConfig.prefix, line++, url.left(data.panelWidth), {});
            url = url.substring(data.panelWidth);
        }
        if (url.length > 0) {
            dualPanel.setLine(panelConfig.prefix, line++, url, {});
        }
    }

}

/* TAB, SWAP */
commander.swapPanel = async () => {
    let panel = commander.getActivePanel();
    //Dont make an info panel active
    if (panel.other.info) {
        return;
    }

    commander.left.active = !commander.left.active;
    commander.right.active = !commander.right.active;
    await commander.draw();
}

commander.swapPanels = async () => {
    const temp = commander.left;
    commander.left = commander.right;
    commander.right = temp;

    //This is unfortunate, a 'clever' hack bleeding thru
    commander.left.prefix = "left";
    commander.right.prefix = "rite";
}

/* Prelude to SELECT, ENTER */
commander.delve = async () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderIdFromPanel(panel);

    if (panel.id != "tree") {
        return await commander.select(id);
    }

    //So, we are dealing with a tree
    commander.left.active = !commander.left.active;
    commander.right.active = !commander.right.active;
    panel.other.info = false;
    panel.other.id = id;
    await commander.select(id);

}

/* SELECT, ENTER */
commander.select = async (index) => {
    const panel = commander.getActivePanel();

    //Do we want to select this for real ?
    const bookmark = await vfs.findItemById(index);

    //Go deeper if its a folder, or as the case may be, higher
    if (bookmark.children) {
        let nextSelected = 0;
        bookmark.children.map(child => child.id).forEach((id, pos) => {
            if (panel.id === id) {
                nextSelected = pos + (index === "0" ? 0 : 1);
            }
        });
        panel.id = index;
        panel.selected = nextSelected;
        panel.scroll = 0;
        panel.selector = "";
        await commander.draw();
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
commander.view = async () => {
    commander.viewing = !commander.viewing;

    if (commander.viewing) {
        dualPanel.hide();

        const panel = commander.getActivePanel();
        const id = dualPanel.getCommanderIdFromPanel(panel);

        if (id != "0") {
            await viewer.view(id);
        } else {
            commander.viewing = false;
        }
    } else {
        dualPanel.show();
        viewer.remove();

        //we require it for decorating the elements, kludgy, I know
        await commander.draw();

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

    const id = dualPanel.getCommanderIdFromPanel(panel);

    if (id != "0") {
        commander.editing = true;
        editor.view(id);
    }
}

/* MENU */
commander.menu = () => {
    dualPanel.unselectItems();
    menu.context.activate();
    menu.show();
}

/* BACKSPACE */
commander.back = async () => {
    const panel = commander.getActivePanel();

    if (panel.id == "search") {
        return await commander.select("0");
    }

    const text = dualPanel.getLineText(panel.prefix, 0);

    if (text == "/..") {
        await commander.select(dualPanel.getCommanderId(panel.prefix, 0));
    }
}

/* DOWN */
commander.down = async () => {
    const panel = commander.getActivePanel();

    if (panel.selected == data.panelHeight - 1) {
        panel.scroll++;
    } else {
        panel.selected++;
    }

    if (!(panel.scroll + panel.selected < panel.itemCount)) {
        return await commander.end();
    }

    await commander.draw();
}

/* PAGE DOWN */
commander.pageDown = async () => {
    const panel = commander.getActivePanel();

    if (panel.selected < data.panelHeight - 1) {
        panel.selected = data.panelHeight - 1;
    } else {
        panel.scroll = panel.scroll + data.panelHeight - 1;
    }

    if (!(panel.scroll + panel.selected < panel.itemCount)) {
        return await commander.end();
    }

    await commander.draw();
}


/* UP */
commander.up = async () => {
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
    await commander.draw();
}

/* PAGE UP */
commander.pageUp = async () => {
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
    await commander.draw();
}

/* HOME */
commander.home = async () => {
    const panel = commander.getActivePanel();
    panel.selected = 0;
    panel.scroll = 0;
    await commander.draw();
}

/* END */
commander.end = async () => {
    const panel = commander.getActivePanel();

    if (panel.itemCount < data.panelHeight + 1) {
        panel.scroll = 0;
        panel.selected = panel.itemCount - 1;
    } else {
        panel.scroll = panel.itemCount - data.panelHeight;
        panel.selected = data.panelHeight - 1;
    }
    await commander.draw();
}

/* COPY */
commander.copy = async () => {
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
        return await commander.copySelection(from, to);
    }

    //Copying from
    const from_id = dualPanel.getCommanderIdFromPanel(from.prefix);

    const bookmark = await vfs.findItemById(from_id);
    await vfs.createItem(to.id, (newBookmark) => {
        if (bookmark.title) {
            newBookmark.title = bookmark.title;
        }
        if (bookmark.url) {
            newBookmark.url = bookmark.url;
        }
    });
    await commander.reInit();
}

/* COPY SELECTION */
commander.copySelection = async (from, to) => {
    const bookmark = await vfs.findItemById(from.id);

    //Minimal paranoia
    if (!bookmark || !bookmark.children) {
        return
    }

    const children = [...await vfs.filter(bookmark.children, from.filter)];

    for (let counter = 0; counter < children.length; counter++) {
        if (children[counter].url && children[counter].url.has(from.selector) || from.selector == "*") {
            let bookmark = children[counter];
            await vfs.createItem(to.id, (newBookmark) => {
                newBookmark.title = bookmark.title;
                if (bookmark.url) {
                    newBookmark.url = bookmark.url;
                }
            });
        }
    }

    await commander.reInit();
}

/* MOVE */
commander.move = async () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderIdFromPanel(panel);
    const bookmark = await vfs.findItemById(id);
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
        return await commander.moveSelection(panel, to);
    }

    await vfs.move(bookmark.id, to.id);
    await commander.reInit();
}

/* MOVE SELECTION */
commander.moveSelection = async (from, to) => {
    const bookmark = await vfs.findItemById(from.id)
    //Minimal paranoia
    if (!bookmark || !bookmark.children) {
        return
    }

    const children = [... await vfs.filter(bookmark.children, from.filter)];

    for (let counter = 0; counter < children.length; counter++) {
        if (children[counter].url && children[counter].url.has(from.selector) || from.selector == "*") {
            const subBookmark = children[counter];

            await vfs.move(subBookmark.id, to.id);
            await commander.reInit();
        }
    }

    await commander.reInit();
}

/* DELETE */
commander.delete = async () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderIdFromPanel(panel);
    //Are we copying a selection ?
    if (panel.selector && panel.selector != "") {
        return await commander.deleteSelection(panel);
    }

    await vfs.remove(id);
    await commander.reInit();
}

/* DELETE SELECTION */
commander.deleteSelection = async (from) => {
    const bookmark = await vfs.findItemById(from.id);

    //Minimal paranoia
    if (!bookmark || !bookmark.children) {
        return
    }

    const children = [...await vfs.filter(bookmark.children, from.filter)];

    for (let counter = 0; counter < children.length; counter++) {
        if (children[counter].url && children[counter].url.has(from.selector) || from.selector == "*") {
            await vfs.remove(children[counter].id);
            await commander.reInit();
        }
    }
    await commander.reInit();
}


/* CREATE FOLDER */
commander.createFolder = async () => {
    const panel = commander.getActivePanel();
    const folderText = prompt("Enter folder name", "");

    if (folderText) {
        const { bookmark, finalPos } = await vfs.createFolder(folderText, panel.id);
        if (pos !== null) {
            panel.selected = finalPos + (panel.id === "0" ? 0 : 1);
            panel.scroll = 0;
            panel.selector = "";
        }
        await commander.draw();
    }
}

/* EQUALIZE */
commander.equalize = async () => {
    const active = commander.getActivePanel();
    const sleepy = commander.getInactivePanel();

    sleepy.id = active.id;
    sleepy.selected = 0;
    sleepy.scroll = 0;

    await commander.draw();
}

/* PLUS , MOVE UP */
commander.moveUp = async () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderIdFromPanel(panel);
    const bookmark = await vfs.findItemById(id);
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

    await vfs.move(id, panel.id, bookmark.index - 1);
    await commander.reInit();
}

/* DOWN, MOVE DOWN */
commander.moveDown = async () => {
    const panel = commander.getActivePanel();
    const id = dualPanel.getCommanderIdFromPanel(panel);
    let bookmark = await vfs.findItemById(id);
    if (panel.id == 0) {
        return;
    }

    if (panel.selected == 0 && panel.scroll == 0) {
        return;
    }

    //now see who is under their
    const parent = await vfs.findItemById(panel.id);
    bookmark = parent.children[bookmark.index + 1];
    if (bookmark) {
        //We are evilly counting on the 'hmmm I think this got deleted feature', muhaha is in order
        if (panel.selected == data.panelHeight - 1) {
            panel.scroll++;
        } else {
            panel.selected++;
        }

        await vfs.move(bookmark.id, panel.id, bookmark.index - 1);
        await commander.reInit();
    }
}

/* SEARCH */
commander.search = async (searchText) => {
    await delay(1);
    if (!searchText) {
        if (commander.query) {
            searchText = commander.query;
        } else {
            searchText = prompt("Enter search string", ""); //"" is the default
        }
    }
    if (searchText) {
        const panel = commander.getActivePanel();
        const results = await vfs.search(searchText);
        panel.id = "search";
        commander.results = results;
        commander.query = searchText;
        await commander.draw();
    }
}

/* FILTER */
commander.filter = async (panel) => {
    if (!panel) {
        panel = commander.getActivePanel();
    }

    panel.filter = prompt("Enter filter string", panel.filter); //"" is the default

    panel.filter.remove("*");

    await commander.draw();
}

/* SELECT */
commander.selector = async (panel) => {
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

    await commander.draw();
}

commander.setInfo = (panel) => {
    panel.other.info = false;
    panel.other.active = true;
    panel.info = true;
    panel.active = false;
}

commander.setList = async (panel) => {
    panel.info = false;

    if (panel.id == "tree") {
        const id = dualPanel.getCommanderIdFromPanel(panel);
        await commander.select(id);
    }
}

commander.setTree = (panel) => {
    panel.info = false;
    panel.id = "tree"
}

commander.sortBookmarksByDate = async (panel, ctrlKey) => await vfs.sortByDate(panel.id, ctrlKey);
commander.sortBookmarksAlphabetically = async (panel, ctrlKey) => await vfs.sortAlphabetically(panel.id, ctrlKey);
commander.sortBookmarksByLength = async (panel, ctrlKey) => await vfs.sortByLength(panel.id, ctrlKey);

commander.getVersion = () => (commander.manifest && commander.manifest.version) || '...';

commander.about = () => options.show('about');


commander.onLeftClick = async (n) => {
    menu.exitIfOut();
    if (data.simpleClickOnSelectedItemToActivate && commander.left.active && commander.left.selected == n) {
        await commander.delve();
    } else {
        commander.left.info = false;
        commander.left.active = true;
        commander.right.active = false;
        commander.left.selected = n;
        await commander.draw();
    }
}

commander.onRightClick = async (n) => {
    menu.exitIfOut();
    if (data.simpleClickOnSelectedItemToActivate && commander.right.active && commander.right.selected == n) {
        await commander.delve();
    } else {
        commander.right.info = false;
        commander.right.active = true;
        commander.left.active = false;
        commander.right.selected = n;
        await commander.draw();
    }
}

commander.onLeftDoubleClick = async (n) => {
    menu.exitIfOut();
    commander.left.info = false;
    commander.left.active = true;
    commander.right.active = false;
    commander.left.selected = n;
    await commander.draw();
    await commander.delve();
}

commander.onRightDoubleClick = async (n) => {
    menu.exitIfOut();
    commander.right.info = false;
    commander.right.active = true;
    commander.left.active = false;
    commander.right.selected = n;
    await commander.draw();
    await commander.delve();
}

commander.initManifest = async () => {
    const response = await fetch('./manifest.json');

    if (response.status != 200) {
        throw new Error(`No 200 status : [${response.status}]`);
    };
    const manifest = await response.json();

    commander.manifest = manifest;
};

commander.initManifestPromise = commander.initManifest();
