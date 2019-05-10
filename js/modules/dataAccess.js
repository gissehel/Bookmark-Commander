const dataAccess = {};

dataAccess.init = () => {
    dataAccess.calibre = createElement('pre', { id: 'calibre', textContent: ' ' }, { appendTo: document.body });

    window.addEventListener('resize', (e) => dataAccess.onSizeChanged());
    dataAccess.reload();
};

dataAccess.reload = () => {
    if (localStorage.size) {
        dataAccess._setSize(localStorage.size);
    } else {
        dataAccess._setSize("12");
    }
    if (localStorage.simpleClickOnSelectedItemDelve === 'true') {
        data.simpleClickOnSelectedItemDelve = true;
    } else {
        dataAccess.simpleClickOnSelectedItemDelve(false);
    }
};

dataAccess.simpleClickOnSelectedItemDelve = (bool) => {
    data.simpleClickOnSelectedItemDelve = bool;
    localStorage.simpleClickOnSelectedItemDelve = `${data.simpleClickOnSelectedItemDelve}`;
}

dataAccess.onSizeChanged = () => {
    const calibre = dataAccess.calibre;
    const calibreRect = calibre.getBoundingClientRect();
    const body = document.body;
    const bodyRect = body.getBoundingClientRect();
    const bh = bodyRect.height;
    const calibreHeight = calibreRect.height;
    const bw = bodyRect.width;
    const calibreWidth = calibreRect.width;
    const nLines = Math.floor((bh - 4) / calibreHeight);
    const nCols = Math.floor((bw - 4) / calibreWidth);
    data.screenWidth = Math.floor(nCols / 2) * 2;
    data.panelHeight = nLines - 6;
    data.calibreWidth = calibreWidth;
    data.calibreHeight = calibreHeight;
    window.bodyRect=bodyRect;

    data.panelWidth = Math.floor((data.screenWidth - 4) / 2);
    data.screenHeight = data.panelHeight + 6;
    dualPanel.redraw();
};

const _setSize = (size) => {
    const body = document.body;
    [...body.classList].filter(x => x.startsWith('size-')).forEach(x => body.classList.remove(x));
    body.classList.add(`size-${size}`);
    dataAccess.onSizeChanged();
};

dataAccess.setSize = (size) => {
    localStorage.size = size;
    _setSize(size);
};

dataAccess._setSize = (size) => {
    _setSize(size);
};
