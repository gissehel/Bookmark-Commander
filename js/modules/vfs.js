const vfs = {};

vfs.init = () => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree((bookmarks) => {
            vfs.bookmarks = bookmarks;
            resolve();
        });
    });
}

/**
 * @param {string} query
 * @returns {Promise<Item>}
 */
vfs.search = (query) => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.search(query, (result) => resolve(result));
    });
};

/**
 * @callback onInitCallback
 * @param {Item} item;
 */

/**
 * @param {number} parentId
 * @param {onInitCallback} onInit
 */
vfs.createItem = (parentId, onInit) => {
    return new Promise((resolve, reject) => {
        const newBookmark = new BookmarkItem({});
        newBookmark.parentId = parentId;        
        if (onInit) {
            onInit(newBookmark);
        }
        chrome.bookmarks.create(newBookmark, resolve);
    });
}

/**
 * @typedef {Object} CreateFolderResult
 * @property {Item} item
 * @property {number} finalPos
 */

/**
 * @param {string} name
 * @param {number} parentId
 * @param {onInitCallback} onInit
 * @returns {Promise<CreateFolderResult>}
 */
vfs.createFolder = (name, parentId, onInit) => {
    return new Promise((resolve, reject) => {
        const newBookmark = new BookmarkItem({});
        newBookmark.parentId = parentId;
        newBookmark.title = name;
        if (onInit) {
            onInit(newBookmark);
        }
        chrome.bookmarks.create(newBookmark, (newItem) => {
            chrome.bookmarks.getTree((bookmarks) => {
                vfs.bookmarks = bookmarks;
                const item = findBookmarkId(bookmarks, parentId);
                let finalPos = null;
                item.children.map(child => child.id).forEach((id, pos) => {
                    if (id === newItem.id) {
                        if (finalPos === null) {
                            finalPos = pos;
                        }
                    }
                });
                resolve({ item, finalPos });
            });
        });
    });
}

/**
 * @param {number} itemId
 * @param {number} destinationId
 * @param {number} index
 * @returns {Promise}
 */
vfs.move = (itemId, destinationId, index) => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.move(itemId, { parentId: destinationId, index }, resolve);
    });
}

vfs.remove = async (itemId) => {
    const bookmark = await vfs.findItemById(itemId);
    await new Promise((resolve, reject) => {
        if (bookmark.children) {
            chrome.bookmarks.removeTree(itemId, resolve);
        } else {
            chrome.bookmarks.remove(itemId, resolve);
        }
    })
}

vfs.findItemById = (id) => {
    return new Promise((resolve, reject) => {
        const bookmark = findBookmarkId(vfs.bookmarks, id);
        resolve(bookmark);
    });
}

vfs.sortByDate = async (bookmarkId, recursive) => sortBookmarks(bookmarkId, sortByDateFunction, recursive);
vfs.sortAlphabetically = async (bookmarkId, recursive) => sortBookmarks(bookmarkId, sortByNameFunction, recursive);
vfs.sortByLength = async (bookmarkId, recursive) => sortBookmarks(bookmarkId, sortByLengthFunction, recursive);


vfs.filter = async (children, filter) => {
    return filterBookmarks(children, filter);
};

vfs.getFullTitle = async (id) => {
    return findBookmarkTitle(id);
}