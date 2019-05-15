class MenuItemBuilder {
    constructor(menuBuilder, items) {
        this._menuBuilder = menuBuilder;
        this._items = items;
    }

    addSep() {
        this._items.push({ isSep: true });
        return this;
    }

    addItem(title, shortCut, command) {
        let item;
        if (typeof (title) === "object") {
            item = title;
        } else {
            if (command === undefined && shortCut !== undefined) {
                command = shortCut;
                shortCut = undefined;
            }
            item = { title, shortCut, command };
        }
        this._items.push(item);
        return this;
    }

    addItems(items) {
        items.forEach(item=>this._items.push(item));
        return this;
    }

    endMenu() {
        return this._menuBuilder;
    }
}

class MenuBuilder {
    constructor(menu) {
        this._menu = menu
        this._current = null;
        this._definition = [];
        this._menu.setDefinition(this._definition);
    }

    addMenu(caption) {
        let topMenu = { caption, itemsData: [] };
        this._current = topMenu;
        this._definition.push(topMenu);
        return new MenuItemBuilder(this, topMenu.itemsData);
    }

    setPanelGetter(getter) {
        if (this._current !== null) {
            this._current.getPanel = getter;
        }
        return this;
    }
}
