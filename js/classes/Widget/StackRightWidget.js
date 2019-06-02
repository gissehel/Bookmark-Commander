class StackRightWidget extends Widget {
    constructor() {
        super();
        this._children = [];
        this._childSpace = 0;
    }

    get width() {
        return (this._children.length + 1) * this._childSpace + sum(this._children.map(widget => widget.width));
    }

    get height() {
        return Math.max(0, ...this._children.map(widget => widget.height));
    }

    setChildSpace(value) {
        this._childSpace = value;
        return this;
    }

    add(widget) {
        if (widget) {
            this._children.push(widget);
        }
        return this;
    }

    _getContent(width, height) {
        const subWidgets = []

        let index = 0;
        width -= this._childSpace;
        while (index < this._children.length - 1) {
            let widget = this._children[index];
            width -= widget.width;
            width -= this._childSpace;
            subWidgets.push(widget.getContent(widget.width, height));
            index += 1;
        }
        if (this._children.length > 0) {
            index = this._children.length - 1;
            let widget = this._children[index];
            width -= this._childSpace;
            subWidgets.push(widget.getContent(width, height));
        }

        const result = [];
        const sep = ' '.repeat(this._childSpace);
        [...Array(height).keys()].forEach((indexLine) => {
            result.push(sep + subWidgets.map(subWidget => subWidget[indexLine]).join(sep) + sep);
        });
        return result;
    }

    setScreenOffset(offsetX, offsetY, width, height) {
        super.setScreenOffset(offsetX, offsetY, width, height);
        let index = 0;
        let localOffset = this._childSpace;
        width -= this._childSpace;
        while (index < this._children.length - 1) {
            let widget = this._children[index];
            widget.setScreenOffset(offsetX + localOffset, offsetY, widget.width, height);
            localOffset += widget.width;
            localOffset += this._childSpace;
            width -= widget.width;
            width -= this._childSpace;
            index += 1;
        }
        if (this._children.length > 0) {
            index = this._children.length - 1;
            let widget = this._children[index];
            width -= this._childSpace;
            widget.setScreenOffset(offsetX + localOffset, offsetY, width, height);
        }
    }
}
