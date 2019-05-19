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
        this._children.push(widget);
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
}


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
        this._children.push(widget);
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
            titleLine = `╔ ${this.title} ${data.doubleBar.repeat(width - (this.title.length + 4))}╗`;
        } else if (4 <= width) {
            titleLine = `╔ ${this.title.slice(0, (this.title.length + 4) - width + 1)} ╗`;
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

class CheckboxWidget extends Widget {
    constructor() {
        super();
        this._title = null;
        this._initState = null;
        this._state = null;
        this._id = null;
        this._getter = null;
        this._setter = null;
        this._formId = null;
    }

    setTitle(value) {
        this._title = value;
        return this;
    }

    setId(value) {
        this._id = value;
        return this;
    }

    setGetter(value) {
        this._getter = value;
        if (this._getter) {
            this._initState = this._getter();
            this.displayedValue = this._initState;
        }
        return this;
    }

    setSetter(value) {
        this._setter = value;
        return this;
    }

    get storedValue() {
        return this._getter ? this._getter() : false;
    }

    set storedValue(value) {
        if (this._setter) {
            this._setter(value)
        };
    }

    get displayedValue() {
        return this._state;
    }

    get hasChanged() {
        return this._state !== this._initState;
    }

    set displayedValue(value) {
        this._state = value;
        let element = this._formId && this._formId.element;
        if (element) {
            if (this.hasChanged) {
                element.classList.add('changed');
            } else {
                element.classList.remove('changed');
            }
            [...this._formId.elementValues].forEach(e => e.textContent = this._state ? 'x' : ' ');
        }
    }

    changeDisplayedValue() {
        this.displayedValue = !this.displayedValue;
    }

    validate() {
        if (this.hasChanged) {
            this.storedValue = this.displayedValue;
        }
    }

    get width() {
        return 6 + this._title.length;
    }

    get height() {
        return 1;
    }

    _getContent(width, height) {
        let id = this._id;
        let title = this._title;
        let paddingLength = width - this._title.length - 6;
        let state = this._state;
        if (paddingLength >= 0) {
            return [` <span id='formItem-item-${id}' class='formItem' data-id='${id}'>[<span class='formItem-checkbox-value'>${state ? 'x' : ' '}</span>] <span id='formItem-label'>${title}</span></span>${' '.repeat(paddingLength)} `];
        } else if (title.length + paddingLength >= 0) {
            return [` <span id='formItem-item-${id}' class='formItem' data-id='${id}'>[<span class='formItem-checkbox-value'>${state ? 'x' : ' '}</span>] <span id='formItem-label'>${title.slice(0, title.length + paddingLength)}</span></span> `];
        } else {
            return ['.'.repeat(width)];
        }

    }

    register(formIds) {
        this._formId = {
            type: 'checkbox',
            widget: this,
            id: this._id,
            element: null,
            elementValues: [],
        };
        formIds[this._id] = this._formId;
        return this;
    }
}

class ButtonWidget extends Widget {
    constructor() {
        super();
        this._title = null;
        this._id = null;
        this._default = false;
        this._onClick = null;
    }

    setTitle(value) {
        this._title = value;
        return this;
    }

    setId(value) {
        this._id = value;
        return this;
    }

    setDefault(value) {
        this._default = value;
        return this;
    }

    setOnClick(value) {
        this._onClick = value;
        return this;
    }

    execute() {
        if (this._onClick) {
            this._onClick();
        }
    }

    get width() {
        return 6 + 2 * (this._default ? 1 : 0) + this._title.length;
    }

    get height() {
        return 1;
    }

    validate() {

    }

    register(formIds) {
        formIds[this._id] = {
            type: 'button',
            widget: this,
            id: this._id,
            default: this._default,
        };
        return this;
    }

    _getContent(width, height) {
        let id = this._id;
        let title = this._title;
        let def = this._default;
        let paddingLength = width - title.length - 6 - 2 * (def ? 1 : 0);
        if (paddingLength >= 0) {
            return [` <span id='formItem-item-${id}' class='formItem formItem-button-${id}' data-id='${id}'>[${def ? '<' : ''} <span id='formItem-label-${id}'>${title}</span> ${def ? '>' : ''}]</span> ${' '.repeat(paddingLength)}`];
        } else if (title.length + paddingLength >= 0) {
            return [` <span id='formItem-item-${id}' class='formItem formItem-button-${id}' data-id='${id}'>[ <span id='formItem-label-${id}'>${title.slice(0, title.length + paddingLength)}</span> ]</span> `];
        } else {
            return ['.'.repeat(width)];
        }

    }
}

class CenteredWidget extends Widget {
    constructor() {
        super();
        this._child;
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