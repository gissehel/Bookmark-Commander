/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/
const editor = {};

//This is where the magic happens, so to say
editor.view = (id) => {
    //Function keys
    editor.function_keys =
        [
            { id: 1, description: "Help  " },
            { id: 2, description: "Save  " },
            { id: 3, description: "Quit  " },
            { id: 4, description: "Quit  " },
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
        editor.function_keys[4].description = '      ';
        editor.urlreadonly = "readonly='readonly'";
    } else {
        editor.urlreadonly = "";
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


    //Table due to general textarea weirdness
    let s = "<pre id='editorScreen'>";
    //Menu
    s = s + "<span class='menu'>" + ("  Folder/Bookmark").extend() + "</span>\n";
    //Its a mess, but a short mess ;\
    s = s + "<textarea class='blue' cols='" + (screenParams.screenwidth - 2) + "' rows='3' id='title'>" + bookmark.title + "</textarea>\n"
    s = s + "<span class='menu'>" + ("  URL").extend() + "</span>\n";
    s = s + "<textarea class='blue' cols='" + (screenParams.screenwidth - 2) + "' rows='"+(screenParams.panelheight)+"' id='url'" + editor.urlreadonly + ">" + content + "</textarea>\n"


    for (let key in editor.function_keys) {
        let f = editor.function_keys[key];
        s = s + ("<span class='fcode'>F" + f.id + "</span><span class='menu'>" + f.description + "</span><span class='fcode'> </span>");
    }
    s = s + ("<span id='end' class='fcode'>" + " ".repeat(screenParams.screenwidth - 91) + "</span>\n");

    document.body.innerHTML = s;

    // Ugly quirk, because width in columns for a textarea isn't enought
    const width = $('.menu').width();
    $('textarea').attr('style',`width: ${width}px`);

    editor.key_mapping_builder.activate();

    //Put focus on the title, at the end
    const title = document.getElementById("title");
    title.focus();
    const position = title.value.length * 2;
    title.setSelectionRange(position, position);

}

editor.considerTextAreas = () => {
    const titleElement = document.getElementById("title")
    const urlElement = document.getElementById("url")

    let _changed = false;

    //Consider the title
    if (titleElement.value != editor.bookmark.title) {
        _changed = true;
        titleElement.style.fontStyle = "italic"
    } else {
        titleElement.style.fontStyle = "normal"
    }

    //Consider the url
    if (urlElement.value != editor.bookmark.content) {
        _changed = true;
        urlElement.style.fontStyle = "italic"
    } else {
        urlElement.style.fontStyle = "normal"
    }

    editor.changed = _changed;

}

editor.test = () => {
    chrome.tabs.create({ 'url': document.getElementById("url").value }, null);
}

editor.save = () => {
    const o = { title: document.getElementById("title").value };

    const url = document.getElementById("url").value.trim();

    if (url.length > 0) {        //o.url = url;
        o.url = editor.condense(url);
    }
    chrome.bookmarks.update(editor.id, o);

    editor.saved = true;

    document.getElementById("end").innerHTML = ("<span style='color: yellow'>" + ("SAVED!").extend(screenParams.screenwidth - 91) + "</span>");

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
    document.body.innerHTML = commander.backup;

    //We need to boot (reread bookmarks from Chome ) if we changed something
    if (editor.saved) {
        commander.boot();
    } else {
        commander.draw();
    }
    commander.key_mapping_builder.activate();
    commander.editing = false;
}

