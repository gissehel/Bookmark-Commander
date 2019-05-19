const createEmptyHtmlRectangle = (width, height) => {
    return [...Array(height)].map(' '.repeat(width));
}

class Widget {
    constructor() {
        this._minWidth = undefined;
        this._minHeight = undefined;
    }

    get width() {
        return this._minWidth || 0;
    }

    get height() {
        return this._minHeight || 0;
    }

    get content() {
        return this.getContent(this.width, this.height);
    }

    get html() {
        return this.getHtml(this.width, this.height);
    }

    _getContent(width, height) {
        return null;
    }

    getContent(width, height) {
        let content = this._getContent(width, height);

        if (content) {
            return content;
        }

        return createEmptyHtmlRectangle(width, height);
    }

    getHtml(width, height) {
        return this.getContent(width, height).join('\n');
    }

    validate() {
    }
}