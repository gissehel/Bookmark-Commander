const addSideMenuItems = (menuItemBuilder) =>
    menuItemBuilder
        .addItem('&List', ({ panel }) => commander.setList(panel))
        .addItem("&Info", ({ panel }) => commander.setInfo(panel))
        .addItem("&Tree", ({ panel }) => commander.setTree(panel))
        .addSep()
        .addItem("Sort by &Date", ({ panel, ctrlKey }) => commander.sortBookmarksByDate(panel, ctrlKey))
        .addItem("&Sort by Length", ({ panel, ctrlKey }) => commander.sortBookmarksByLength(panel, ctrlKey))
        .addItem("Sort &Alphabetically", ({ panel, ctrlKey }) => commander.sortBookmarksAlphabetically(panel, ctrlKey))
        .addSep()
        .addItem("&Filter", "/", ({ panel }) => commander.filter(panel))
        .addItem("Select", "*", ({ panel }) => commander.selector(panel))
        .addItem("&Rescan", "C-r", () => { })
        .endMenu()

    ;

addSideMenuItems(menu.build().addMenu('Left'))
    .setPanelGetter(() => commander.left);

menu
    .build()
    .addMenu('File')
    .addItem('&Help', 'F1', commander.help)
    .addItem('Mirror', 'F2', commander.equalize)
    .addItem('View', 'F3', commander.view)
    .addItem('Edit', 'F4', commander.edit)
    .addItem('Copy', 'F5', commander.copy)
    .addItem('Move', 'F6', commander.move)
    .addItem('Create Folder', 'F7', commander.createFolder)
    .addItem('Delete', 'F8', commander.delete)
    .addItem('Quit', 'F10', commander.quit)
    .addSep()
    .addItem('Move up', '+', commander.moveUp)
    .addItem('Move down', '-', commander.moveDown)
    .addItem('Select', '*', commander.selector)
    .addItem('Filter', '/', commander.filter)
    .endMenu()

menu
    .build()
    .addMenu('Command')
    .addItem('&Search', () => commander.search())
    .addItem('S&wap panels', commander.swapPanels)
    .addSep()
    .addItem('&About', commander.about)
    .endMenu()

menu
    .build()
    .addMenu('Options')
    .addItem('&Options', () => options.show('options'))
    .addSep()
    .addItems([...Array(11).keys()].map(x => 10 + x).map(size => ({
        title: `${size}px`,
        command: () => dataAccess.setSize(size),
    })))
    .endMenu()

addSideMenuItems(menu.build().addMenu('Right'))
    .setPanelGetter(() => commander.right);
