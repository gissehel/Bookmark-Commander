
class FormGroupBuilder {
    constructor(formBuilder, title) {
        this._formBuilder = formBuilder;
        this._group = { title, items: [] };
    }

    get group() {
        return this._group;
    }

    addCheckbox(title, getter, setter) {
        const item = {
            type: 'checkbox',
            title,
            getter,
            setter,
        };
        this._group.items.push(item);
        return this;
    }

    addCombo(title, getValues, getter, setter) {
        const item = {
            type: 'checkbox',
            title,
            getValues,
            getter,
            setter,
        };
        this._group.items.push(item);
        return this;
    }

    endGroup() {
        return this._formBuilder;
    }
}

class FormBuilder {
    constructor() {
        this._form = { groups: [] };
    }

    setName(id, name) {
        this.form.id = id;
        this.form.name = name;
        return this;
    }

    get form() {
        return this._form;
    }

    addGroup(title) {
        let formGroupBuilder = new FormGroupBuilder(this, title);
        this.form.groups.push(formGroupBuilder.group);
        return formGroupBuilder;
    }

    register(options) {
        options.setPopupContent(this.form);
        return null;
    }
}



