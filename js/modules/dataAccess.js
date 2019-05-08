const dataAccess = {};

dataAccess.init = () => {
    const calibre = document.createElement('pre');
    calibre.id = 'calibre';
    calibre.textContent = ' ';
    document.body.appendChild(calibre);
    dataAccess.calibre = calibre;

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
    const bh = body.clientHeight;
    const ch = calibreRect.height;
    const bw = body.clientWidth;
    const cw = calibreRect.width;
    const nLines = Math.floor((bh - 12) / ch);
    const nCols = Math.floor((bw - 4) / cw);
    data.screenWidth = Math.floor(nCols / 2) * 2;
    data.panelHeight = nLines - 6;

    data.panelWidth = Math.floor((data.screenWidth - 4) / 2);
    data.screenHeight = data.panelHeight + 6;
    dualPanel.redraw();
};


const _setSize = (size) => {
    const $body = $('body');
    [...$body[0].classList].filter(x => x.startsWith('size-')).forEach(x => $body.removeClass(x));
    $body.addClass(`size-${size}`);
    dataAccess.onSizeChanged();
};

dataAccess.setSize = (size) => {
    localStorage.size = size;
    _setSize(size);
};

dataAccess._setSize = (size) => {
    _setSize(size);
};
