
/* These codes were retrieved from http://www.utf8-chartable.de/unicode-utf8-table.pl ( box drawing )
 ┌─┬─┐  ╔═╦═╗
 ├─┼─┤  ╠═╬═╣
 │ │ │  ║ ║ ║
 └─┴─┘  ╚═╩═╝
*/

const dualPanel = {};

dualPanel.init = () => {
    if (navigator.userAgent.has("Mac")) {
        data.shouldReplaceHBar = true;
        data.doubleBar = "=";
    }

    dualPanel.element = createElement('pre', { id: 'dualPanel' }, { appendTo: document.body });
    dualPanel.redraw();
}

dualPanel.hide = () => {
    dualPanel.element.classList.add('hidden');
}

dualPanel.show = () => {
    dualPanel.element.classList.remove('hidden');
}

dualPanel.setRootText = (prefix, title, active) => {
    const root = dualPanel[prefix].root;

    if (title === null) {
        root.innerText = "╔" + data.doubleBar.repeat(data.panelWidth) + "╗";
    } else {
        let text = ` ${title} `;
        let postText = '';
        if (text.length > data.panelWidth) {
            text = "..." + text.right(data.panelWidth - 3);
        } else {
            postText = data.doubleBar.repeat(data.panelWidth - text.length);
        }
        root.innerHTML = "╔" + (active ? "<span class='active-title'>" : "") + text + (active ? "</span>" : "") + postText + "╗";
    }

};
dualPanel.getCommanderId = (prefix, n) => dualPanel[prefix].lines[n].commander.id;
dualPanel.getLineText = (prefix, n) => dualPanel[prefix].lines[n].innerText.trim();

dualPanel.redraw = () => {
    const panelIds = [...Array(data.panelHeight).keys()];
    dualPanel.panelIds = panelIds;

    dualPanel.element.innerText = '';

    const mainSpan = createElement('span', { className: 'border' }, { appendTo: dualPanel.element });
    const titleSpan = createElement('span', null, { appendTo: mainSpan });
    const left = dualPanel.left = {};
    const right = dualPanel.rite = {};
    left.root = createElement('span', null, { appendTo: titleSpan });
    right.root = createElement('span', null, { appendTo: titleSpan });
    createElement('span', null, { text: '\n', appendTo: titleSpan });
    left.lines={};
    right.lines={};
    panelIds.forEach((counter) => {
        const lineSpan = createElement('span', null, { appendTo: mainSpan });
        createElement('span', null, { text: '║', appendTo: lineSpan });
        left.lines[counter] = createElement('span', {className:'leftItem border', dataIndex: counter}, { appendTo: lineSpan });
        createElement('span', null, { text: '║║', appendTo: lineSpan });
        right.lines[counter] = createElement('span', {className:'riteItem border', dataIndex: counter}, { appendTo: lineSpan });
        createElement('span', null, { text: '║\n', appendTo: lineSpan });
    });
    createElement('span', null, { text: `╠${data.doubleBar.repeat(data.panelWidth)}╩╩${data.doubleBar.repeat(data.panelWidth)}╣\n`, appendTo: mainSpan });
    createElement('span', null, { text: '║', appendTo: mainSpan });
    dualPanel.url = createElement('span', null, { appendTo: mainSpan });
    createElement('span', null, { text: '║\n', appendTo: mainSpan });
    createElement('span', null, { text: `╚${data.doubleBar.repeat((data.panelWidth + 1) * 2)}╝`, appendTo: mainSpan });

    dualPanel.element.style.top = data.calibreHeight;

    menu.refresh();
    commander.init();
}

dualPanel.unselectItems = () => [...document.getElementsByClassName('selected')].forEach(element => element.classList.remove('selected'));

dualPanel.setLine = (prefix, n, text, props) => {
    props = props || {};
    const isJs = props.isJs;
    const isSelected = props.isSelected;
    const id = props.id || null;
    const filter = props.filter || null;
    const highlighted = props.highlighted;

    const element = dualPanel[prefix].lines[n];

    if (!element) {
        return;
    }

    if (isJs) {
        element.classList.add('js');
    } else {
        element.classList.remove('js');
    }

    if (isSelected) {
        element.classList.add('selected');
    } else {
        element.classList.remove('selected');
    }

    let innerHTML = (text).extend(data.panelWidth);

    if (filter) {
        innerHTML = innerHTML.replaceAll(filter, "\u2604");
        innerHTML = innerHTML.replaceAll("\u2604", "<span class='paars'>" + filter + "</span>");
    }

    if (highlighted) {
        innerHTML = "<span class='yellow'>" + innerHTML + "</span>";
    }

    element.innerHTML = innerHTML
    element.commander = { id };
};

dualPanel.setUrl = (url) => {
    const width = (data.panelWidth + 1) * 2;
    let text = url;
    if (url.length > width) {
        text = url.substring(0, width);
    } else {
        text = url + ' '.repeat(width - url.length);
    };
    dualPanel.url.innerText = text;
};