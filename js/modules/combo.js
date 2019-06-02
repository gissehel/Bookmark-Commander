combo = {};

combo.init = () => {
    combo.panel = createElement(
        'div',
        { id: 'comboPanel' },
        { appendTo: document.body }
    );
    createElement(
        'div',
        { id: 'comboPanelClickBait' },
        { appendTo: combo.panel }
    );
    combo.panelContent = createElement(
        'pre',
        { id: 'comboPanelContent' },
        { appendTo: combo.panel }
    );
};

combo.show = ({ values, currentIndex, onSuccess, onCancel, offsetX, offsetY }) => {
    combo.context.activate();

    combo.values = values;
    combo.index = currentIndex;
    if (combo.index == -1) {
        combo.index = 0;
    }
    combo.onSuccess = onSuccess;
    combo.onCancel = onCancel;
    combo.offsetX = offsetX;
    combo.offsetY = offsetY;
    combo.dataWidth = Math.max(...combo.values.map((value) => value.length));
    combo.dataHeight = values.length;
    combo.width = combo.dataWidth + 4;
    combo.height = combo.dataHeight + 2;

    combo.panelContent.innerText = '';
    createElement('div', null, { text: `╔${data.doubleBar.repeat(combo.dataWidth + 2)}╗`, appendTo: combo.panelContent });
    combo.elements = combo.values.map((value, index) => {
        const line = createElement('div', null, { appendTo: combo.panelContent });
        createElement('span', null, { text: '║ ', appendTo: line });
        const element = createElement('span', { className: 'comboItem', dataIndex: index }, { text: value.extend(combo.dataWidth), appendTo: line });
        createElement('span', null, { text: ' ║', appendTo: line });
        return element;
    });
    createElement('div', null, { text: `╚${data.doubleBar.repeat(combo.dataWidth + 2)}╝`, appendTo: combo.panelContent });

    combo.setOffset(offsetX, offsetY);
    combo.refresh();
    combo.panel.classList.add('displayed');
};

combo.setOffset = (offsetX, offsetY) => {
    combo.panelContent.style.left = offsetX * data.calibreWidth;
    combo.panelContent.style.top = offsetY * data.calibreHeight;
};

combo.close = () => {
    combo.panelContent.innerText = '';
    combo.panel.classList.remove('displayed');
    combo.elements = [];
    options.context.activate();
}

combo.refresh = () => {
    combo.elements.forEach((element, index) => {
        if (index === combo.index) {
            element.classList.add('selected');
        } else {
            element.classList.remove('selected');
        }
    });
}

combo.select = (index) => {
    if (data.simpleClickOnSelectedItemToActivate && index !== undefined && combo.index === index) {
        combo.validate();
        return;
    }
    combo.index = index;
    combo.refresh();
}

combo.selectValidate = (index) => {
    combo.select(index);
    combo.validate();
}

combo.goUp = () => {
    combo.index = (combo.index + combo.values.length - 1) % (combo.values.length);
    combo.refresh();
}

combo.goDown = () => {
    combo.index = (combo.index + 1) % (combo.values.length);
    combo.refresh();
}

combo.validate = () => {
    combo.onSuccess(combo.values[combo.index], combo.index);
    combo.close();
}

combo.cancel = () => {
    combo.onCancel();
    combo.close();
}
