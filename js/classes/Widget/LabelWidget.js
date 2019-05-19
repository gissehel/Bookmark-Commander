class LabelWidget extends Widget {
    constructor() {
        super();
        this._content = null;
        this._getter = null;
        this._selectable = false;
    }

    setContent(value) {
        if (value) {
            this._content = value;
        }
        return this;
    }

    setGetter(value) {
        if (value) {
            this._getter = value;
            this._content = this._getter();
        }
        return this;
    }

    setSelectable(value) {
        this._selectable = value || false;
        return this;
    }

    setId(value) {
        this._id = value;
        return this;
    }

    get width() {
        return this._content.length;
    }

    get height() {
        return 1;
    }

    register(formIds) {
        this._content = this._content || '';
        if (this._selectable) {
            formIds[this._id] = {
                type: 'label',
                id: this._id,
                widget: this,
            };
        }
        return this;
    }

    _getContent(width, height) {
        let id = this._id;
        let content = this._content;
        let selectable = this._selectable;
        let paddingLength = width - content.length;
        if (paddingLength >= 0) {
            return [`<span '${selectable ? `id='formItem-item-${id}'` : ''}>${content}</span>${' '.repeat(paddingLength)}`];
        } else if (width > 3) {
            return [`<span '${selectable ? `id='formItem-item-${id}'` : ''}>${content.slice(0, width - 3)}...</span>`];
        } else {
            return ['.'.repeat(width)];
        }
    }
}