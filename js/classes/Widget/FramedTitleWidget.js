class FramedTitleWidget extends Widget {
    constructor() {
        super();
        this._child = undefined;
        this._title = undefined;
    }

    get title() {
        return this._title || '';
    }

    set title(value) {
        this._title = value;
    }

    get child() {
        return this._child;
    }

    set child(value) {
        this._child = value;
    }

    setTitle(value) {
        this.title = value;
        return this;
    }

    setChild(value) {
        this.child = value;
        return this;
    }

    get width() {
        if (!this.child) {
            return (this._title ? 2 : 0);
        }
        return (this._title ? 2 : 0) + this.child.width;
    }

    get height() {
        if (!this.child) {
            return (this._title ? 2 : 0);
        }
        return (this._title ? 2 : 0) + this.child.height;
    }

    _getContent(width, height) {
        if (this._title === null) {
            return this._child.getContent(width, height);
        }
        let titleLine = null;
        if (this.title.length + 4 <= width) {
            titleLine = `╔ <span class='popupTitle'>${this.title}</span> ${data.doubleBar.repeat(width - (this.title.length + 4))}╗`;
        } else if (4 <= width) {
            titleLine = `╔ <span class='popupTitle'>${this.title.slice(0, (this.title.length + 4) - width + 1)}</span> ╗`;
        } else {
            titleLine = `╔${' '.repeat(width - 2)}╗`;
        }
        let childLines = null;
        if (this.child) {
            childLines = this.child.getContent(width - 2, height - 2);
        } else {
            childLines = createEmptyHtmlRectangle(width - 2, height - 2);
        }

        return [
            titleLine,
            ...childLines.map(line => `║${line}║`),
            `╚${data.doubleBar.repeat(width - 2)}╝`,
        ]
    }

}
