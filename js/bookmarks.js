/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

/*
  "662" <- a cookie for the better googler
  Yes, google provides a search function, but I can debug this one
*/
const findBookmarkId = (stuff, id) => {
    if (id == "search") {
        return prepareSearchResults();
    }

    if (id == "tree") {
        return getBookmarkTree(stuff);
    }

    let node;

    const seek = (stuff, id) => {
        if (stuff && stuff.id && stuff.id == id) {
            node = stuff;
        } else {
            Object.keys(stuff).forEach(key => {
                if (typeof stuff[key] == "object") {
                    seek(stuff[key], id);
                }
            });
        }
    }
    seek(stuff, id);

    return node;
}

/* 
  Get the bookmark info for the 'Tree' feature
  Note this decorates the bookmark objects with depth
  Recursive inline function stolen from above
*/
const getBookmarkTree = (stuff) => {
    if (stuff.tree) {
        return stuff.tree
    }

    //Yes, old skool, { a:b } is overrated
    let node = {};
    node.dateAdded = 0;
    node.dateGroupModified = 0;
    node.id = "tree";
    node.index = 1;
    node.parentId = 0;
    node.title = "Tree";
    node.children = [];

    const seek = (stuff, depth) => {
        if (stuff && stuff.children) {
            stuff.depth = depth;
            node.children.push(stuff)
            for (let i = 0; i < stuff.children.length; i++) {
                seek(stuff.children[i], depth + 2);
            }
        }
    }

    seek(stuff[0].children[0], 0); //Do the bookmark bar
    seek(stuff[0].children[1], 0); //Do the other bookmarks
    stuff.tree = node; //Prevent the stupid

    return node;
}

/*
  Create a fake bookmark object to append the results to
  results come from commander.results , stored there by commander.search()
*/
const prepareSearchResults = () => {
    if (!commander.results) {
        commander.results = [];
    }

    const results = [];

    results.dateAdded = 0;
    results.dateGroupModified = 0;
    results.id = "search";
    results.index = 1;
    results.parentId = 0;
    results.title = "Search Results";

    results.children = commander.results;
    return results;
}

/*
  Create a new array with children whose URL matches the filter
  Note : It just feels correct to not filter folder names..
*/
const filterBookmarks = (children, filter) => {
    if (!filter || !children || filter == "") {
        return children;
    }

    const a = [];

    for (let i = 0; i < children.length; i++) {
        let push = true;
        if (children[i].title && !children[i].title.has(filter)) {
            if ((children[i].url && !children[i].url.has(filter))) {
                push = false;
            }
        }

        if (push) {
            a.push(children[i]);
        }
    }

    return a;
}

/*
  Find the canonical to a given folder
  Used for both the top of panel and the URL location in Tree mode
*/
const findBookmarkTitle = (id) => {
    //Deal with search
    if (id == "search") {
        return "/Search?=" + commander.query;
    }

    //This is not entirely true, sue me
    let parent = findBookmarkId(commander.bookmarks, id);
    //Start from scratch
    let title = "";

    //Indicate whether we are dealing with a folder
    if (parent.children) {
        title = title + "/";
    }

    //Do some recursive magic
    while (parent.parentId) {
        title = "/" + parent.title + title;
        parent = findBookmarkId(commander.bookmarks, parent.parentId);
    }
    //Prefix & postfix to make it look even better
    title = " " + title + " ";
    //Cut off at the right size
    if (title.length > data.panelWidth) {
        title = "..." + title.right(data.panelWidth - 3);
    }
    //Give it back
    return title
}

/*
  Multifunctional sorter
*/
const sortBookmarks = (id, foldersTop, f, recursive) => {
    const folder = findBookmarkId(commander.bookmarks, id);

    if (!folder.children) {
        return;
    }

    folder.children.sort(f);

    for (let counter = folder.children.length - 1; counter > -1; counter--) {
        chrome.bookmarks.move(folder.children[counter].id, { parentId: id, index: counter });

        if (recursive) {
            sortBookmarks(folder.children[counter].id, null, f, recursive);
        }
    }
    commander.reInit();
}

const catchLogAndReturnDefault = (def, code) => {
    try {
        return code(a, b);
    } catch (e) {
        console.log(e);
        return def;
    }
}

// Less than 0: Sort "a" to be a lower index than "b"
// Zero: "a" and "b" should be considered equal, and no sorting performed.
// Greater than 0: Sort "b" to be a lower index than "a".

const sortByDateFunction = (a, b) => catchLogAndReturnDefault(0, () => {
    if (a.dateGroupModified && !b.dateGroupModified) return -1;
    if (b.dateGroupModified && !a.dateGroupModified) return 1;

    return a.dateAdded - b.dateAdded;
});


const sortByLengthFunction = (a, b) => catchLogAndReturnDefault(0, () => {
    if (a.dateGroupModified && !b.dateGroupModified) return -1;
    if (b.dateGroupModified && !a.dateGroupModified) return 1;

    return a.title.length - b.title.length;
});


const sortByNameFunction = (a, b) => catchLogAndReturnDefault(0, () => {
    if (a.dateGroupModified && !b.dateGroupModified) return -1;
    if (b.dateGroupModified && !a.dateGroupModified) return 1;

    if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
    if (b.title.toUpperCase() > a.title.toUpperCase()) return -1;
    return 0;
});

