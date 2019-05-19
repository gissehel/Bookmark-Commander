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
