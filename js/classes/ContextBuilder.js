class ContextBuilder {
    constructor(menu) {
        this._keys = {};
        this._shortcuts = {};
        this._shortcuts.hasShortCut = false;
        this._shortcuts.byName = {};
        this._shortcuts.byIndex = {};
        this._shortcuts.byKeyName = {};
        this._menuBuilder = new MenuBuilder(this);
        this._menu = menu;
        this._noMenu = false;
    }

    get keys() {
        return this._keys;
    }

    get shortcuts() {
        return this._shortcuts;
    }

    activate() {
        keyboard.keyMapping = this.keys;
        if (this._noMenu) {
            this._menu.hide();
        } else if (this._menuBuilder.definition.mainItems.length>0) {
            this._menu.setDefinition(this._menuBuilder.definition);
        }
        if (this.shortcuts.hasShortCut) {
            shortcutBar.setCurrent(this.shortcuts);
            shortcutBar.redraw();
        }
        return this;
    }

    add(key, code) {
        this.keys[key] = code;
        return this;
    }

    addKey(key, code) {
        this.keys[key] = code;
        return this;
    }

    addShortcut(index, name, code) {
        const shortCut = {index, name, code, keyName:`F${index}`};
        this.shortcuts.byIndex[shortCut.index] = shortCut;
        this.shortcuts.byKeyName[shortCut.keyName] = shortCut;
        this.shortcuts.byName[shortCut.name] = shortCut;
        this.shortcuts.hasShortCut = true;
        return this;
    }

    addMenu(caption) {
        return this._menuBuilder.addMenu(caption);
    }

    setPanelGetter(getter) {
        return this._menuBuilder.setPanelGetter(getter);
    }

    bindTo(obj) {
        obj.context = this;
        return this;
    }

    noMenu() {
        this._noMenu = true;
        return this;
    }
}
