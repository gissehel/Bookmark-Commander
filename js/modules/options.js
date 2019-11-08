const options = {};

options.init = () => {
    if (! isOfficial()) {
        document.body.classList.add('non-official-version');
    }
    options.popup = createElement(
        'div',
        { id: 'popup' },
        { appendTo: document.body }
    );
    options.popupContent = createElement(
        'pre',
        {
            id: 'popupContent',
        },
        { text: '', appendTo: options.popup }
    );
    options.formIds = {};
    options.currentId = 0;
    options.selected = null;
}

options.setPopupContent = (popup) => {
    options.popups = options.popups || {};
    options.popups[popup.id] = popup;
}


options.show = (popupId) => {
    options.current = options.popups[popupId];
    const formContent = options.getFormContent();
    if (formContent) {
        let offsetX = Math.floor((data.screenWidth - formContent.width) / 2);
        let offsetY = Math.floor((data.screenHeight - formContent.height) / 2);
        formContent.formWidget.setScreenOffset(offsetX, offsetY, formContent.width, formContent.height);
        window.w = formContent.formWidget;
        options.popupContent.style.left = offsetX * data.calibreWidth;
        options.popupContent.style.top = offsetY * data.calibreHeight;
        options.popupContent.innerHTML = formContent.content;
        options.popup.classList.add('displayed');

        Object.keys(options.formIds).forEach((dataId) => {
            const formId = options.formIds[dataId];
            formId.element = document.getElementById(`formItem-item-${dataId}`);
            switch (formId.type) {
                case 'checkbox':
                    formId.elementValues = formId.element.getElementsByClassName('formItem-checkbox-value');
                    break;
                case 'combo':
                    formId.elementValues = formId.element.getElementsByClassName('formItem-combo-value');
                    break;
            }
        });
        options.selected = null;
        const defaultIds = Object.keys(options.formIds).filter((dataId) => options.formIds[dataId] && options.formIds[dataId].type === 'button' && options.formIds[dataId].default);
        if (defaultIds.length === 1) {
            options.select(defaultIds[0]);
        } else {
            options.select(Object.keys(options.formIds)[0]);
        }
        options.context.activate();
    } else {
        options.close();
    }
}

options.close = () => {
    options.popup.classList.remove('displayed')
    options.formIds = {};
    options.current = null;
    commander.context.activate();
}

options.validate = () => {
    Object.keys(options.formIds).forEach((dataId) => {
        options.formIds[dataId].widget.validate();
    });
    options.close();
}


options.cancel = () => options.close();

options.getFormContent = () => {
    if (options.current) {
        options.formIds = {};

        const formWidget = new FramedTitleDualWidget()
            .setTitle(options.current.name)
            .setChildTop(
                new StackDownWidget()
                    .addMap(options.current.groups, (group) => {
                        return new FramedTitleWidget()
                            .setTitle(group.title)
                            .setChild(
                                new StackDownWidget()
                                    .addMap(group.items, (item) => {
                                        switch (item.type) {
                                            case 'checkbox':
                                                return new CheckboxWidget()
                                                    .setTitle(item.title)
                                                    .setId(options.getNextId())
                                                    .setGetter(item.getter)
                                                    .setSetter(item.setter)
                                                    .register(options.formIds);
                                            case 'combo':
                                                return new ComboWidget()
                                                    .setTitle(item.title)
                                                    .setId(options.getNextId())
                                                    .setGetValues(item.getValues)
                                                    .setGetter(item.getter)
                                                    .setSetter(item.setter)
                                                    .register(options.formIds);
                                            case 'label':
                                                return new LabelWidget()
                                                    .setContent(item.content)
                                                    .setGetter(item.getter)
                                                    .setSelectable(item.selectable)
                                                    .setId(options.getNextId())
                                                    .register(options.formIds);
                                            case 'button':
                                                return new CenteredWidget().setChild(
                                                    new ButtonWidget()
                                                        .setTitle(item.title)
                                                        .setOnClick(item.onClick)
                                                        .setId(options.getNextId())
                                                        .register(options.formIds)
                                                );
                                        }
                                        return null;
                                    })
                            );
                    })
            )
            .setChildBottom(
                new CenteredWidget()
                    .setChild(
                        new StackRightWidget()
                            .setChildSpace(0)
                            .add(
                                options.current.result.ok ?
                                    new ButtonWidget()
                                        .setTitle('Ok')
                                        .setId(options.getNextId())
                                        .setDefault(true)
                                        .setOnClick(() => options.validate())
                                        .register(options.formIds)
                                    : null
                            )
                            .add(
                                options.current.result.cancel ?
                                    new ButtonWidget()
                                        .setTitle('Cancel')
                                        .setId(options.getNextId())
                                        .setOnClick(() => options.cancel())
                                        .register(options.formIds)
                                    : null
                            )
                    )
            )
            ;

        // window.formWidget = formWidget;
        return {
            width: formWidget.width,
            height: formWidget.height,
            content: formWidget.html,
            formWidget,
        }
    }
    return null;
}

options.getNextId = () => {
    options.currentId += 1;
    return options.currentId;
}

options.select = (dataId) => {
    if (data.simpleClickOnSelectedItemToActivate && dataId !== undefined && options.selected === dataId) {
        options.activate(dataId);
        return;
    }
    const formInfo = options.formIds[dataId];
    let element = formInfo && formInfo.element;
    if (element && formInfo) {
        options.selected = dataId;
        Object.keys(options.formIds)
            .map(dataId => options.formIds[dataId].element)
            .filter(element => element && element.classList)
            .filter(element => [...element.classList].filter((c) => c === 'fcode').length)
            .forEach(element => element.classList.remove('fcode'))
            ;
        element.classList.add('fcode');
    }
}

options.goNext = () => {
    let selected = options.selected;
    let dataIds = Object.keys(options.formIds);
    let index = dataIds.indexOf(selected);
    options.select(dataIds[(index + 1) % (dataIds.length)]);
}

options.goPrev = () => {
    let selected = options.selected;
    let dataIds = Object.keys(options.formIds);
    let index = dataIds.indexOf(selected);
    if (index < 0) {
        index = 0;
    }
    options.select(dataIds[(index + dataIds.length - 1) % (dataIds.length)]);
}

options.activate = (dataId) => {
    if (dataId === undefined) {
        dataId = options.selected;
    } else {
        if (options.selected !== dataId) {
            options.select(dataId);
        }
    }

    const formInfo = options.formIds[dataId];
    if (formInfo) {
        switch (formInfo.type) {
            case 'checkbox':
                formInfo.widget.changeDisplayedValue();
                break;
            case 'button':
                formInfo.widget.execute();
                break;
            case 'combo':
                {
                    const values = formInfo.widget.values.map((item) => item.title);
                    const currentIndex = formInfo.widget.index;
                    const onSuccess = (value, index) => {
                        formInfo.widget.index = index;
                    };
                    const onCancel = () => { };
                    const offsetX = formInfo.widget.offsetValue;
                    const offsetY = formInfo.widget.ScreenOffsetY;
                    combo.show({ values, currentIndex, onSuccess, onCancel, offsetX, offsetY });
                }

                formInfo.widget.values;
                break;
        }
    }
};


options.newForm = (id, name) => new FormBuilder().setName(id, name);


