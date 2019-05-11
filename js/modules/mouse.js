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

            if (data.simpleClickOnSelectedItemDelve) {
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
                    if (data.simpleClickOnSelectedItemDelve) {
                        onClick();
                    }
                }, data.doubleClickTimeout),
                onClick,
            }
        }
    };
})();

mouse.onClick = (event) => {
    const { srcElement } = event;
    if (srcElement.closest('.leftItem')) {
        const n = srcElement.attributes['data-index'].value * 1;
        handleClickDoubleClick(srcElement, () => commander.onLeftClick(n), () => commander.onLeftDoubleClick(n));
    } else if (srcElement.closest('.riteItem')) {
        const n = srcElement.attributes['data-index'].value * 1;
        handleClickDoubleClick(srcElement, () => commander.onRightClick(n), () => commander.onRightDoubleClick(n));
    } else if (srcElement.closest('.topMenuItem')) {
        const menuIndex = srcElement.attributes['data-index'].value * 1;
        menu.current = menu.items[menuIndex];
        menu.selection = 0;
        commander.menu();
    } else if (srcElement.closest('.menuItem')) {
        const n = srcElement.attributes['data-index'].value * 1;
        const { shiftKey, ctrlKey, altKey } = event;
        const keys = { shiftKey, ctrlKey, altKey };
        handleClickDoubleClick(n, () => menu.select(n), () => menu.dispatch(keys, n));
    }
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
