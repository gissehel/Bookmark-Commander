/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

mouse = {};

const handleClickDoubleClick = (() => {
    let lastClick = null;

    return (target, onClick, onDoubleClick) => {
        if (lastClick && lastClick.target === target) {
            if (lastClick.timer) {
                clearTimeout(lastClick.timer);
            }
            lastClick = null;

            onDoubleClick();
        } else {
            let lastOnClick = lastClick && lastClick.onClick;
            if (lastClick && lastClick.timer) {
                clearTimeout(lastClick.timer);
            }
            lastClick = null;

            if (data.simpleClickOnSelectedItemToActivate) {
                if (lastOnClick) {
                    lastOnClick();
                }
            } else {
                onClick();
            }

            lastClick = {
                target,
                timer: setTimeout(() => {
                    if (lastClick && lastClick.timer) {
                        clearTimeout(lastClick.timer);
                    }
                    lastClick = null;
                    if (data.simpleClickOnSelectedItemToActivate) {
                        onClick();
                    }
                }, data.doubleClickTimeout),
                onClick,
            }
        }
    };
})();

mouse.onClickActions = {
    '.leftItem': (element) => {
        const n = element.attributes['dataIndex'].value * 1;
        handleClickDoubleClick(element, () => commander.onLeftClick(n), () => commander.onLeftDoubleClick(n));
    },
    '.riteItem': (element) => {
        const n = element.attributes['dataIndex'].value * 1;
        handleClickDoubleClick(element, () => commander.onRightClick(n), () => commander.onRightDoubleClick(n));
    },
    '.topMenuItem': (element) => {
        const menuIndex = element.attributes['data-index'].value * 1;
        menu.open(menuIndex);
    },
    '.menuItem': (element) => {
        const n = element.attributes['data-index'].value * 1;
        const { shiftKey, ctrlKey, altKey } = event;
        const keys = { shiftKey, ctrlKey, altKey };
        handleClickDoubleClick(n, () => menu.select(keys, n), () => menu.dispatch(keys, n));
    },
    '.formItem': (element) => {
        const dataId = element.attributes['data-id'].value;
        handleClickDoubleClick(dataId, () => options.select(dataId), () => options.activate(dataId));
    },
    '.shortcut': (element) => {
        const dataIndex = element.attributes['data-index'].value;
        shortcutBar.processShortcut(`F${dataIndex}`)
    },
    '.comboItem': (element) => {
        const dataIndex = element.attributes['dataIndex'].value * 1;
        handleClickDoubleClick(element, () => combo.select(dataIndex), () => combo.selectValidate(dataIndex));
    },
    '#comboPanelClickBait': () => {
        combo.cancel();
    },
}

mouse.onClick = (event) => {
    const { srcElement } = event;
    Object.keys(mouse.onClickActions).forEach((selector) => {
        let element = srcElement.closest(selector);
        if (element) {
            mouse.onClickActions[selector](element);
        }
    });
}

mouse.init = () => {
    document.body.addEventListener('wheel', mouse.onScroll);
    document.body.addEventListener('click', mouse.onClick);
}

/* If we ever get enough user feedback, we might change this
   to jump more than 1 entry per scrolly
*/
mouse.onScroll = (e) => {
    if (e.wheelDelta > 0) {
        //Go Up
        commander.up();
    } else {
        //Go Down
        commander.down();
    }
    return false;
}
