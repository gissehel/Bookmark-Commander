/**
 * 
 */
class Item {
    constructor() {
        this._title = null;
        this._content = null;
        this._id = null;
        this._raw = null;
    }

    /**
     * Set the title of the item
     * @param {string} value
     */
    set title (value) {
        this._title = value;
    }

    /**
     * Set the content of the item
     * @param {string} value
     */
    set content (value) {
        this._content = value;
    }

    /**
     * Set the id of the item
     * @param {number} value
     */
    set id (value) {
        this._id = value;
    }

    /**
     * Set the raw of the item
     * @param {any} value
     */
    set raw (value) {
        this._raw = value;
    }

    /**
     * Set the children of the item
     * @param {Item[]} value
     */
    set children(value) {
        this._children = value;
    }

    /**
     * Set the parent id of the item
     * @param {number} value
     */
    set parentId(value) {
        this._parentId = value;
    }

    /**
     * Get the title of the item
     * @returns {string}
     */
    get title () {
        return this._title;
    }

    /**
     * Get the content of the item
     * @returns {string}
     */
    get content () {
        return this._content;
    }

    /**
     * Get the id of the item
     * @returns {number}
     */
    get id () {
        return this._id;
    }

    /**
     * Get the raw of the item
     * @returns {any}
     */
    get raw () {
        return this._raw;
    }

    /**
     * Get the children of the item
     * @return {Item[]}
     */
    get children() {
        return this._children;
    }

    /**
     * Get the parent id of the item
     * @returns {number}
     */
    get parentId() {
        return this._parentId;
    }
}