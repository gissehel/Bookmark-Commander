
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
    dualPanel.element.style.top = data.calibreHeight;

    menu.refresh();
    commander.init();
}
