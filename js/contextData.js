context.create()
    .bindTo(viewer)
    .addShortcut(1, 'Help', commander.help)
    .addShortcut(3, 'View', commander.view)
    .addShortcut(5, 'View', commander.view)
    .addShortcut(10, 'Quit', commander.view)
    .addKey('Escape', commander.view)
    .addKey('Tab', () => { })
    .noMenu()
    ;

context.create()
    .bindTo(editor)
    .addShortcut(1, 'Help', commander.help)
    .addShortcut(2, 'Save', editor.save)
    .addShortcut(3, 'Quit', editor.quit)
    .addShortcut(4, 'Quit', editor.quit)
    .addShortcut(5, 'Test', editor.test)
    .addShortcut(10, 'Quit', editor.quit)
    .addKey('Escape', editor.quit)
    .noMenu()
    ;

context.create()
    .bindTo(menu)
    .addKey('ArrowLeft', menu.goLeft)
    .addKey('ArrowRight', menu.goRight)
    .addKey('ArrowUp', menu.goUp)
    .addKey('ArrowDown', menu.goDown)
    .addKey('Enter', menu.dispatch)
    .addKey('Ctrl+Enter', menu.dispatch)
    .addKey('Escape', menu.exit)
    .addShortcut(9, 'Exit', menu.exit)
    .addKey('Tab', () => { })
    ;

context.create()
    .bindTo(commander)
    .addKey('Backspace', commander.back)
    .addKey('Tab', commander.swapPanel)
    .addKey('ArrowLeft', commander.swapPanel)
    .addKey('ArrowRight', commander.swapPanel)
    .addKey('Enter', commander.delve)
    .addKey('Space', commander.delve)
    .addKey('PageUp', commander.pageUp)
    .addKey('PageDown', commander.pageDown)
    .addKey('ArrowUp', commander.up)
    .addKey('ArrowDown', commander.down)
    .addKey('Shift+ArrowUp', commander.moveUp)
    .addKey('Shift+ArrowDown', commander.moveDown)
    .addKey('Home', commander.home)
    .addKey('End', commander.end)
    .addKey('*', commander.selector)
    .addShortcut(1, 'Help', commander.help)
    .addShortcut(2, 'Mirror', commander.equalize)
    .addShortcut(3, 'View', commander.view)
    .addShortcut(4, 'Edit', commander.edit)
    .addShortcut(5, 'Copy', commander.copy)
    .addShortcut(6, 'Move', commander.move)
    .addShortcut(7, 'MkDir', commander.createFolder)
    .addShortcut(8, 'Delete', commander.delete)
    .addShortcut(9, 'Menu', commander.menu)
    .addShortcut(10, 'Quit', commander.quit)
    .addKey('+', commander.moveUp)
    .addKey('-', commander.moveDown)
    .addKey('/', commander.filter)
    ;

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

addSideMenuItems(commander.context.addMenu('Left'))
    .setPanelGetter(() => commander.left);

commander.context
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

commander.context
    .addMenu('Command')
    .addItem('&Search', () => commander.search())
    .addItem('S&wap panels', commander.swapPanels)
    .addSep()
    .addItem('&About', commander.about)
    .endMenu()

commander.context
    .addMenu('Options')
    .addItem('&Options', () => options.show('options'))
    .addSep()
    .addItems([...Array(11).keys()].map(x => 10 + x).map(size => ({
        title: `${size}px`,
        command: () => dataAccess.setSize(size),
    })))
    .endMenu()

addSideMenuItems(commander.context.addMenu('Right'))
    .setPanelGetter(() => commander.right);

context.create()
    .bindTo(options)
    .addKey('Escape', options.cancel)
    .addKey('Enter', options.validate)
    .addKey('Space', () => options.activate())
    .addKey('ArrowLeft', options.goPrev)
    .addKey('ArrowRight', options.goNext)
    .addKey('ArrowUp', options.goPrev)
    .addKey('ArrowDown', options.goNext)
    .addKey('Tab', options.goNext)
    .addShortcut(2, 'Select', () => options.activate())
    .addShortcut(10, 'Cancel', options.cancel)
    ;

options
    .newForm('options', 'Options')
    .addGroup(null)
    .addCheckbox('Double click to activate', () => (!data.simpleClickOnSelectedItemToActivate), (value) => { dataAccess.simpleClickOnSelectedItemToActivate(!value) })
    .endGroup()
    .register(options)
    ;

options
    .newForm('about', 'About')
    .addGroup(null)
    .addLabel(' Orthodox Bookmark Manager ')
    .addLabel(() => ` Version ${commander.getVersion()} `)
    .addLabel('')
    .addButton('Help', commander.help)
    .endGroup()
    .disableCancel()
    .register(options)
    ;
