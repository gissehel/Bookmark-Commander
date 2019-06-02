const createEmptyHtmlRectangle = (width, height) => {
    return [...Array(height)].map(' '.repeat(width));
}

class Widget {
    constructor() {
        this._minWidth = undefined;
        this._minHeight = undefined;
        this._screenOffsetX = 0;
        this._screenOffsetY = 0;
        this._actualWidth = 0;
        this._actualHeight = 0;
    }

    setScreenOffset(offsetX, offsetY, width, height) {
        this._screenOffsetX = offsetX;
        this._screenOffsetY = offsetY;
        this._actualWidth = width;
        this._actualHeight = height;
    }

    get ActualWidth() {
        return this._actualWidth || 0;
    }

    get ActualHeight() {
        return this._actualHeight || 0;
    }

    get ScreenOffsetX() {
        return this._screenOffsetX || 0;
    }

    get ScreenOffsetY() {
        return this._screenOffsetY || 0;
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