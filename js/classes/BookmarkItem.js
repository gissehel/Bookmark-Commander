/**
 * 
 */
class BookmarkItem extends Item {
    constructor(bookmark) {
        super();
        this._raw = bookmark;
    }

    /**
     * Set the title of the item
     * @param {string} value
     */
    set title (value) {
        this._raw.title = value;
    }

    /**
     * Set the content of the item
     * @param {string} value
     */
    set content (value) {
        this._raw.url = value;
    }

    /**
     * Set the children of the item
     * @param {Item[]} value
     */
    set children(value) {
        this._raw.children = value;
    }

    /**
     * Set the parent id of the item
     * @param {number} value
     */
    set parentId(value) {
        this._raw.parentId = value;
    }

    /**
     * Get the title of the item
     * @returns {string}
     */
    get title () {
        return this._raw.title;
    }

    /**
     * Get the content of the item
     * @returns {string}
     */
    get content () {
        return this._raw.url;
    }

    /**
     * Get the children of the item
     * @return {Item[]}
     */
    get children() {
        return this._raw.children;
    }

    /**
     * Get the parent id of the item
     * @returns {number}
     */
    get parentId() {
        return this._raw.parentId;
    }
}
