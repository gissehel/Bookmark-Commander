/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/
const viewer = {};

//This is where the magic happens, so to say
viewer.view = function (id) {
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

    s = "<pre id='viewerScreen'>";
    //Menu
    s = s + "<span class='menu'>" + findBookmarkTitle(id).extend() + "</span>\n";

    s = s + "<textarea class='blue' cols='" + (screenParams.screenwidth - 2) + "' rows='3' readonly='readonly'>" + bookmark.title + "</textarea>\n"
    s = s + "<span class='menu'>" + ("  URL").extend() + "</span>\n";
    s = s + "<textarea class='blue' cols='" + (screenParams.screenwidth - 2) + "' rows='" + (screenParams.panelheight) + "' readonly='readonly'>" + content + "</textarea>\n"


    for (let key in viewer.function_keys) {
        const f = viewer.function_keys[key];
        s = s + "<span class='fcode'>F" + f.id + "</span><span class='menu'>" + f.description + "</span><span class='fcode'> </span>";
    }

    s = s + "<span id='end' class='fcode'>" + " ".repeat(screenParams.screenwidth - 91) + "</span>\n";

    document.body.innerHTML = s;

    // Ugly quirk, because width in columns for a textarea isn't enought
    const width = $('.menu').width();
    $('textarea').attr('style', `width: ${width}px`);

    viewer.key_mapping_builder.activate();
}

viewer.test = function () {
    if (viewer.bookmark.url.length > 0) {
        chrome.tabs.create({ 'url': viewer.bookmark.url }, null);
    }
}