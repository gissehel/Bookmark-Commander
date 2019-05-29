/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/
const editor = {};

//This is where the magic happens, so to say
editor.view = (id) => {
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
        editor.urlReadOnly = "readonly='readonly'";
    } else {
        editor.urlReadOnly = "";
    }

    editor.id = id;
    editor.bookmark = bookmark;
    editor.changed = false;
    editor.saved = false;

    //Show javascript nicely, clone into content as to not mess up the original object, this is view after all
    let content = bookmark.url;
    if (content.startsWith("j")) {
        content = js_beautify(content, { 'indent_size': 2 });
    }
    editor.bookmark.content = content;

    editor.element = createElement('pre', {
        id: 'editorScreen',
        innerHTML: sum([
            `<span id='editorMenu' class='menu'>${("  Folder/Bookmark").extend()}</span>\n`,
            `<textarea class='blue' cols='${data.screenWidth}' rows='3' id='editorTitle'>${bookmark.title}</textarea>\n`,
            `<span class='menu'>${("  URL").extend()}</span>\n`,
            `<textarea class='blue' cols='${(data.screenWidth)}' rows='${(data.panelHeight)}' id='editorUrl'${editor.urlReadOnly}>${content}</textarea>\n`,
        ]),
    }, { appendTo: document.body });

    // editor.menu = document.getElementById('editorMenu');
    editor.url = document.getElementById('editorUrl');
    // editor.end = document.getElementById('editorEnd');
    editor.title = document.getElementById('editorTitle');

    // Ugly quirk, because width in columns for a textarea isn't enought
    editor.title.style.width = data.screenWidth * data.calibreWidth;
    editor.title.style.height = 3 * data.calibreHeight;

    editor.url.style.width = data.screenWidth * data.calibreWidth;
    editor.url.style.height = data.panelHeight * data.calibreHeight;

    editor.context.activate();

    //Put focus on the title, at the end
    const title = editor.title;
    title.focus();
    const position = title.value.length * 2;
    title.setSelectionRange(position, position);
}

editor.remove = () => {
    if (editor.element) {
        document.body.removeChild(editor.element);
        editor.element = null;
    }
}

editor.considerTextAreas = () => {
    const titleElement = editor.title;
    const urlElement = editor.url;

    let _changed = false;

    //Consider the title
    if (titleElement.value != editor.bookmark.title) {
        _changed = true;
        titleElement.classList.add('changed');
    } else {
        titleElement.classList.remove('changed');
    }

    //Consider the url
    if (urlElement.value != editor.bookmark.content) {
        _changed = true;
        urlElement.classList.add('changed');
    } else {
        urlElement.classList.remove('changed');
    }

    editor.changed = _changed;
    if (editor.changed) {
        shortcutBar.redraw();
    }
}

editor.test = () => {
    chrome.tabs.create({ 'url': editor.url.value }, null);
}

editor.save = () => {
    const o = { title: editor.title.value };

    const url = editor.url.value.trim();

    if (url.length > 0) {        //o.url = url;
        o.url = editor.condense(url);
    }
    chrome.bookmarks.update(editor.id, o);

    editor.saved = true;

    shortcutBar.redraw('  SAVED !')

    editor.bookmark = o;

    //Yes, this is messy
    //For editing purpose we keep refering to the uncondensed url
    editor.bookmark.content = url;

}

editor.condense = (url) => {
    let s = "";

    //This only is needed with js bookmarklets
    if (!url.startsWith("j")) {
        return url;
    }
    const ta = url.split("\n");

    for (let key in ta) {
        //The beautifier inlines comment
        //So we need to explitly outline those
        let line = ta[key].trim();
        if (line.startsWith("/*")) {
            line = "\n" + line;
        }
        s = s + line;
    }

    return s;
}

//TODO, ask whether the user wants to save ?
editor.quit = () => {
    editor.remove();

    //We need to reinit (reread bookmarks from Chome ) if we changed something
    if (editor.saved) {
        commander.reInit();
    } else {
        commander.draw();
    }
    commander.context.activate();
    commander.editing = false;

    dualPanel.show();
}

