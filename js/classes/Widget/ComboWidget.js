class ComboWidget extends Widget {
    constructor() {
        super();
        this._title = null;
        this._initIndex = null;
        this._state = null;
        this._id = null;
        this._values = null;
        this._valuesSize = 0;
        this._getter = null;
        this._setter = null;
        this._formId = null;
        this._index = 0;
    }

    setTitle(value) {
        this._title = value;
        return this;
    }

    setId(value) {
        this._id = value;
        return this;
    }

    setGetValues(value) {
        this._values = [];
        value().forEach((item) => {
            if (typeof (item) === typeof ('')) {
                this._values.push({
                    'title': item,
                    'value': item,
                });
            } else if (item.title) {
                this._values.push({
                    'title': item.title,
                    'value': item.value,
                });
            } else {
                this._values.push({
                    'title': `${item}`,
                    'value': item,
                });
            }
        });
        this._valuesSize = Math.max(...this._values.map(x => x.title.length));
        if (this._getter && this._values) {
            const initState = this._getter();
            this._initIndex = this._values.map((value, index) => ({ index, isValue: (value.value === initState) })).filter(x => x.isValue).map(x => x.index)[0];
            this._index = this._initIndex;
        }
        return this;
    }

    get values() {
        return this._values;
    }

    setGetter(value) {
        this._getter = value;
        if (this._getter && this._values) {
            const initState = this._getter();
            this._initIndex = this._values.map((value, index) => ({ index, isValue: (value.value === initState) })).filter(x => x.isValue).map(x => x.index)[0];
            this._index = this._initIndex;
        }
        return this;
    }

    set index(value) {
        if (value === undefined) {
            this._index = 0;
        } else {
            this._index = value;
        }
        let element = this._formId && this._formId.element;
        if (element) {
            if (this.hasChanged) {
                element.classList.add('changed');
            } else {
                element.classList.remove('changed');
            }
            [...this._formId.elementValues].forEach(e => e.textContent = this.displayedValue);
        }
    }

    get index() {
        return this._index;
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
        const valueSize = this._valuesSize || 1;
        if (! this._values || this._index === undefined) {
            return ''.extend(valueSize);
        }
        return this._values[this._index].title.left(valueSize).extend(valueSize);
    }

    get state() {
        if (! this._values || this._index === undefined) {
            return '';
        }
        return this._values[this._index].value;
    }

    get hasChanged() {
        return this._index !== this._initIndex;
    }

    validate() {
        if (this.hasChanged) {
            this.storedValue = this.state;
        }
    }

    get width() {
        return 7 + this._title.length + this._valuesSize;
    }

    get height() {
        return 1;
    }

    _getContent(width, height) {
        let id = this._id;
        let title = this._title;
        let state = this.displayedValue;
        let paddingLength = width - title.length - 7 - state.length;
        if (paddingLength >= 0) {
            return [` <span id='formItem-label'>${title}</span>${' '.repeat(paddingLength)} <span id='formItem-item-${id}' class='formItem formItem-combo-zone' data-id='${id}'>[ <span class='formItem-combo-value'>${state}</span> ]</span> `];
        } else if (title.length + paddingLength >= 0) {
            return [` <span id='formItem-label'>${title.slice(0, title.length + paddingLength)}</span>${' '.repeat(paddingLength)} <span id='formItem-item-${id}' class='formItem formItem-combo-zone' data-id='${id}'>[ <span class='formItem-combo-value'>${state}</span> ] </span>`];
        } else {
            return ['.'.repeat(width)];
        }

    }

    get offsetValue() {
        return this.ScreenOffsetX + this.ActualWidth - 5 - this._valuesSize;        
    }

    register(formIds) {
        this._formId = {
            type: 'combo',
            widget: this,
            id: this._id,
            element: null,
            elementValues: [],
        };
        formIds[this._id] = this._formId;
        return this;
    }
}
