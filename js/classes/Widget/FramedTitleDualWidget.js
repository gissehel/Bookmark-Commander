class FramedTitleDualWidget extends Widget {
    constructor() {
        super();
        this._childTop = undefined;
        this._childBottom = undefined;
        this._title = undefined;
    }

    get title() {
        return this._title || '';
    }

    set title(value) {
        this._title = value;
    }

    set childTop(value) {
        this._childTop = value;
    }

    set childBottom(value) {
        this._childBottom = value;
    }

    get childTop() {
        return this._childTop;
    }

    get childBottom() {
        return this._childBottom;
    }

    setTitle(value) {
        this.title = value;
        return this;
    }

    setChildTop(value) {
        this.childTop = value;
        return this;
    }

    setChildBottom(value) {
        this.childBottom = value;
        return this;
    }

    get width() {
        let childTopWidth = this.childTop ? this.childTop.width : 0;
        let childBottomWidth = this.childBottom ? this.childBottom.width : 0;
        return 2 + Math.max(childTopWidth, childBottomWidth);
    }

    get height() {
        let childTopHeight = this.childTop ? this.childTop.height : 0;
        let childBottomHeight = this.childBottom ? this.childBottom.height : 0;
        return 3 + childTopHeight + childBottomHeight;
    }

    _getContent(width, height) {
        let titleLine = null;
        if (this.title.length + 4 <= width) {
            titleLine = `╔ ${this.title} ${data.doubleBar.repeat(width - (this.title.length + 4))}╗`;
        } else if (4 <= width) {
            titleLine = `╔ ${this.title.slice(0, (this.title.length + 4) - width + 1)} ╗`;
        } else {
            titleLine = `╔${' '.repeat(width - 2)}╗`;
        }
        let childBottomLines = null;
        if (this.childBottom) {
            childBottomLines = this.childBottom.getContent(width - 2, this.childBottom.height);
        } else {
            childBottomLines = [];
        }

        let childTopLines = null;
        if (this.childTop) {
            childTopLines = this.childTop.getContent(width - 2, height - 3 - childBottomLines.length);
        } else {
            childTopLines = [...Array(height - 3 - childBottomLines.length)].map(x => ' '.repeat(width - 2))
        }

        return [
            titleLine,
            ...childTopLines.map(line => `║${line}║`),
            `╠${data.doubleBar.repeat(width - 2)}╣`,
            ...childBottomLines.map(line => `║${line}║`),
            `╚${data.doubleBar.repeat(width - 2)}╝`,
        ]
    }

}
