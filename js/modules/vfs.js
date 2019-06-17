const vfs = {};

vfs.init = () => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree((bookmarks) => {
            vfs.bookmarks = bookmarks;
            resolve();
        });
    });
}

vfs.search = (query) => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.search(query, (result) => resolve(result));
    });
};

vfs.createItem = (parent, onInit) => {
    return new Promise((resolve, reject) => {
        const newBookmark = { parentId: parent.id };
        if (onInit) {
            onInit(newBookmark);
        }
        chrome.bookmarks.create(newBookmark, resolve);
    });
}

vfs.createFolder = (name, parent, onInit) => {
    return new Promise((resolve, reject) => {
        const newBookmark = { parentId: parent.id, title: name };
        if (onInit) {
            onInit(newBookmark);
        }
        chrome.bookmarks.create(newBookmark, (newItem) => {
            chrome.bookmarks.getTree((bookmarks) => {
                vfs.bookmarks = bookmarks;
                const bookmark = findBookmarkId(bookmarks, parent.id);
                let finalPos = null;
                bookmark.children.map(child => child.id).forEach((id, pos) => {
                    if (id === newItem.id) {
                        if (finalPos === null) {
                            finalPos = pos;
                        }
                    }
                });
                resolve(bookmark, finalPos);
            });
        });
    });
}

vfs.move = (item, destination, index) => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.move(item.id, { parentId: destination.id, index }, resolve);
    });
}

vfs.remove = (item) => {
    return new Promise((resolve, reject) => {
        if (bookmark.children) {
            chrome.bookmarks.removeTree(item.id, resolve);
        } else {
            chrome.bookmarks.remove(item.id, resolve);
        }
    });
}

vfs.findItemById = (id) => {
    return new Promise((resolve, reject) => {
        const bookmark = findBookmarkId(vfs.bookmarks, id);
        resolve(bookmark);
    });
}