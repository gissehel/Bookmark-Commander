/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/
const viewer = {};

//This is where the magic happens, so to say
viewer.view = (id) => {
    //Function keys
    viewer.function_keys =
        [
            { id: 1, description: "Help  " },
            { id: 2, description: "Edit  " },
            { id: 3, description: "Quit  " },
            { id: 4, description: "      " },
            { id: 5, description: "Test  " },
            { id: 6, description: "      " },
            { id: 7, description: "      " },
            { id: 8, description: "      " },
            { id: 9, description: "      " },
            { id: 10, description: "Quit  " },
        ];

    let bookmark = findBookmarkId(commander.bookmarks, id);

    if (!bookmark) {
        bookmark = { title: 'Something went terribly wrong', url: '' };
    }

    if (!bookmark.title) {
        bookmark.title = 'Something went terribly wrong';
    }

    if (!bookmark.url) {
        //Avoid the dreaded undefined ;]
        bookmark.url = '';
        //Dont show test for folders
        viewer.function_keys[4].description = '      ';
    }

    viewer.id = id;
    viewer.bookmark = bookmark;

    //Show javascript nicely, clone into content as to not mess up the original object, this is view after all
    let content = bookmark.url;
    if (content.startsWith("j")) {
        content = js_beautify(content, { 'indent_size': 2 });
    }

    viewer.element = createElement('pre', {
        id: 'viewerScreen',
        innerHTML: sum([
            `<span id='viewerMenu' class='menu'>${findBookmarkTitle(id).extend()}</span>\n`,
            `<textarea class='blue' cols='${data.screenWidth}' rows='3' id='viewerTitle' readonly='readonly'>${bookmark.title}</textarea>\n`,
            `<span class='menu'>${"  URL".extend()}</span>\n`,
            `<textarea class='blue' cols='${data.screenWidth}' rows='${data.panelHeight}' id='viewerUrl' readonly='readonly'>${content}</textarea>\n`,
            ...viewer.function_keys.map(f => `<span class='fcode'> F${f.id}</span><span class='menu'>${f.description}</span><span class='fcode'></span>`),
            `<span id='end' class='fcode'>${" ".repeat(data.screenWidth - 91)}</span>\n`,
        ]),
    }, { appendTo: document.body });

    viewer.url = document.getElementById('viewerUrl');
    viewer.title = document.getElementById('viewerTitle');

    // Ugly quirk, because width in columns for a textarea isn't enought
    viewer.title.style.width = data.screenWidth * data.calibreWidth;
    viewer.title.style.height = 3 * data.calibreHeight;
    
    viewer.url.style.width = data.screenWidth * data.calibreWidth;
    viewer.url.style.height = data.panelHeight * data.calibreHeight;

    viewer.key_mapping_builder.activate();
}

viewer.remove = () => {
    if (viewer.element) {
        document.body.removeChild(viewer.element);
        viewer.element = null;
    }
}

viewer.test = () => {
    if (viewer.bookmark.url.length > 0) {
        chrome.tabs.create({ 'url': viewer.bookmark.url }, null);
    }
}