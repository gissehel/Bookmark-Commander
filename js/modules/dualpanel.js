
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

    const element = document.createElement('pre');
    element.id = 'dualPanel';
    document.body.appendChild(element);
    dualPanel.element = element;
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
    const function_keys =
        [
            { id: 1, description: "Help  " },
            { id: 2, description: "Mirror" },
            { id: 3, description: "View  " },
            { id: 4, description: "Edit  " },
            { id: 5, description: "Copy  " },
            { id: 6, description: "Move  " },
            { id: 7, description: "Mkdir " },
            { id: 8, description: "Delete" },
            { id: 9, description: "PullDn" },
            { id: 10, description: "Quit  " },
        ];

    dualPanel.element.innerHTML = sum([
        "<span id='menu' class='menu' style='position:relative;z-index:2'></span>\n",
        "<span class='border'>",
        "<span id='h1'><span id='leftroot'></span><span id='riteroot'></span></span>\n",
        ...panelIds.map((counter) => sum([
            `║<span id='left${counter}' class='border'>${" ".repeat(data.panelWidth)}</span>║`,
            `║<span id='rite${counter}' class='border'>${" ".repeat(data.panelWidth)}</span>║`,
            "\n",
        ])),
        `<span>╠${data.doubleBar.repeat(data.panelWidth)}╩╩${data.doubleBar.repeat(data.panelWidth)}╣</span>\n`,
        `║<span id='url'>${" ".repeat((data.panelWidth + 1) * 2)}</span>║\n`,
        `<span>╚${data.doubleBar.repeat((data.panelWidth + 1) * 2)}╝</span>\n`,
        "</span>",
        ...function_keys.map((functionKey) => `<span class='fcode'> F${functionKey.id}</span><span class='menu' id='f${functionKey.id}'>${functionKey.description}</span><span class='fcode'></span>`),
        `<span id='end' class='fcode'>${" ".repeat(data.screenWidth - 91)}</span>\n`,
    ]);
    dualPanel.url = document.getElementById("url");
    menu.refresh();
    commander.init();
}
