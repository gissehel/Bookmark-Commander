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
