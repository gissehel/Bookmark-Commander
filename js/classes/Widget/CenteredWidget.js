class CenteredWidget extends Widget {
    constructor() {
        super();
        this._child;
    }

    setScreenOffset(offsetX, offsetY, width, height) {
        super.setScreenOffset(offsetX, offsetY, width, height);
        if (this._child) {
            const childWidth = this._child.width;
            const childHeight = this._child.height;

            let leftPad = 0;
            let topPad = 0;
            if (width > childWidth) {
                leftPad = Math.floor((width - childWidth) / 2);
            }

            if (height > childHeight) {
                topPad = Math.floor((height - childHeight) / 2);
            }
            this._child.setScreenOffset(offsetX + leftPad, offsetY + topPad, childWidth, childHeight);
        }
    }

    get width() {
        return this._child ? this._child.width : 0;
    }

    get height() {
        return this._child ? this._child.height : 0;
    }

    setChild(value) {
        this._child = value;
        return this;
    }

    _getContent(width, height) {
        if (this._child) {
            const childWidth = this._child.width;
            const childHeight = this._child.height;

            let lines = this._child.content;

            if (width > childWidth) {
                const leftPad = Math.floor((width - childWidth) / 2);
                let preLine = ' '.repeat(leftPad);
                let postLine = ' '.repeat(width - childWidth - leftPad);
                lines = lines.map(line => `${preLine}${line}${postLine}`);
            }

            if (height > childHeight) {
                const topPad = Math.floor((height - childHeight) / 2);
                let preLines = [...Array(topPad)].map(x => ' '.repeat(width));
                let postLines = [...Array(height - childHeight - topPad)].map(x => ' '.repeat(width));
                lines = [...preLines, ...lines, ...postLines];
            }
            return lines;
        } else {
            return createEmptyHtmlRectangle(width, height);
        }
    }
}
