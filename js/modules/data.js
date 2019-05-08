const data = {};

data.init = () => {
    window.addEventListener('resize', (e) => data.onSizeChanged());
    data.reload();
};

data.reload = () => {
    if (localStorage.size) {
        data._setSize(localStorage.size);
    } else {
        data._setSize("12");
    }
    if (localStorage.simpleClickOnSelectedItemDelve === 'true') {
        screenParams.simpleClickOnSelectedItemDelve = true;
    } else {
        data.simpleClickOnSelectedItemDelve(false);
    }
};

data.simpleClickOnSelectedItemDelve = (bool) => {
    screenParams.simpleClickOnSelectedItemDelve = bool;
    localStorage.simpleClickOnSelectedItemDelve = `${screenParams.simpleClickOnSelectedItemDelve}`;
}

data.onSizeChanged = () => {
    const calibre = window.calibre;
    const calibreRect = calibre.getBoundingClientRect();
    const body = document.body;
    const bh = body.clientHeight;
    const ch = calibreRect.height;
    const bw = body.clientWidth;
    const cw = calibreRect.width;
    const nlines = Math.floor((bh-12)/ch);
    const ncols = Math.floor((bw-4)/cw);
    screenParams.screenwidth = Math.floor(ncols/2)*2;
    screenParams.panelheight = nlines - 6;

    screenParams.panelwidth = Math.floor((screenParams.screenwidth - 4) / 2);
    screenParams.screenheight = screenParams.panelheight+6;
    dualPanel.init();
};


const _setSize = (size) => {
    const $body = $('body');
    [...$body[0].classList].filter(x => x.startsWith('size-')).forEach(x => $body.removeClass(x));
    $body.addClass(`size-${size}`);
    data.onSizeChanged();
};

data.setSize = (size) => {
    localStorage.size = size;
    _setSize(size);
};

data._setSize = (size) => {
    _setSize(size);
};
