
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

    dualPanel.element.innerHTML = sum([
        "<span class='border'>",
        "<span id='h1'><span id='leftroot'></span><span id='riteroot'></span></span>\n",
        ...panelIds.map((counter) => sum([
            `║<span id='left${counter}' class='leftItem border' data-index='${counter}'>${" ".repeat(data.panelWidth)}</span>║`,
            `║<span id='rite${counter}' class='riteItem border' data-index='${counter}'>${" ".repeat(data.panelWidth)}</span>║`,
            "\n",
        ])),
        `<span>╠${data.doubleBar.repeat(data.panelWidth)}╩╩${data.doubleBar.repeat(data.panelWidth)}╣</span>\n`,
        `║<span id='url'>${" ".repeat((data.panelWidth + 1) * 2)}</span>║\n`,
        `<span>╚${data.doubleBar.repeat((data.panelWidth + 1) * 2)}╝</span>\n`,
        "</span>",
    ]);
    dualPanel.url = document.getElementById("url");
    ['left', 'rite'].forEach((prefix) => {
        dualPanel[prefix] = {};
        const panel = dualPanel[prefix];
        panel.root = document.getElementById(prefix + 'root');
        panel.lines = panelIds.map((counter) => document.getElementById(`${prefix}${counter}`));
    });
    dualPanel.element.style.top = data.calibreHeight;

    menu.refresh();
    commander.init();
}
