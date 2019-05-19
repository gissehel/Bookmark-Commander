class StackDownWidget extends Widget {
    constructor() {
        super();
        this._children = [];
    }

    get width() {
        return Math.max(0, ...this._children.map(widget => widget.width));
    }

    get height() {
        return sum(this._children.map(widget => widget.height));
    }

    add(widget) {
        if (widget) {
            this._children.push(widget);
        }
        return this;
    }

    addMap(array, onItem) {
        array.map(onItem).filter(widget => widget).forEach(widget => this.add(widget));
        return this;
    }

    _getContent(width, height) {
        const result = []
        let index = 0;
        while (index < this._children.length - 1) {
            let widget = this._children[index];
            widget.getContent(width, widget.height).forEach(element => {
                result.push(element);
                height -= 1;
            });;
            index += 1;
        }
        if (this._children.length > 0) {
            index = this._children.length - 1;
            let widget = this._children[index];
            widget.getContent(width, height).forEach(element => {
                result.push(element);
            });;
        }

        return result;
    }
}
