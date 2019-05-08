/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

mouse = {};

const handleClickDoubleClick = (() => {
    let handleClickDoubleClick_lastClick = null;

    return (target, onClick, onDoubleClick) => {
        if (handleClickDoubleClick_lastClick && handleClickDoubleClick_lastClick.target === target) {
            if (handleClickDoubleClick_lastClick.timer) {
                clearTimeout(handleClickDoubleClick_lastClick.timer);
            }
            handleClickDoubleClick_lastClick = null;

            onDoubleClick();
        } else {
            let lastOnClick = handleClickDoubleClick_lastClick && handleClickDoubleClick_lastClick.onClick;
            if (handleClickDoubleClick_lastClick && handleClickDoubleClick_lastClick.timer) {
                clearTimeout(handleClickDoubleClick_lastClick.timer);
            }
            handleClickDoubleClick_lastClick = null;

            if (data.simpleClickOnSelectedItemDelve) {
                if (lastOnClick) {
                    lastOnClick();
                }
            } else {
                onClick();
            }



            handleClickDoubleClick_lastClick = {
                target,
                timer: setTimeout(() => {
                    if (handleClickDoubleClick_lastClick && handleClickDoubleClick_lastClick.timer) {
                        clearTimeout(handleClickDoubleClick_lastClick.timer);
                    }
                    handleClickDoubleClick_lastClick = null;
                    if (data.simpleClickOnSelectedItemDelve) {
                        onClick();
                    }
                }, data.doubleClickTimeout),
                onClick,
            }
        }
    };
})();

mouse.init = () => {
    document.body.addEventListener('wheel', mouse.scroll);


    //We go for each item and give it a mouse click event listener
    //Note the very cool 'live' which means listener also counts for newly created divs
    //which happens all the time in bookmark commander
    //if an item was already clicked then we assume the user wants to execute it (delve)
    for (let i = 0; i < data.panelHeight; i++) {
        $("#left" + i).live("click",
            (e) => {
                const n = e.srcElement.id.substring(4);
                handleClickDoubleClick(e.currentTarget, () => commander.on_left_click(n), () => commander.on_left_dblclick(n));
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return true;
            }
        )
        $("#rite" + i).live("click",
            (e) => {
                const n = e.srcElement.id.substring(4);
                handleClickDoubleClick(e.currentTarget, () => commander.on_right_click(n), () => commander.on_right_dblclick(n));
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return true;
            }
        )
    }

    // Ugly, but less ugly than having a bunch of XXXXXX in a <hidden> elements with opacity 0 for formatting reasons,
    //  that hijack the clicks.
    $("hidden").live("click",
        (e) => {
            menu.exitIfOut();
            return false;
        }
    )
    $(".topMenuItem").live("click", (event) => {
        const menuIndex = event.currentTarget.attributes['data-index'].value * 1;
        menu.current = menu.items[menuIndex];
        menu.selection = 0;
        commander.menu();
    });
    $(".menuItem").live("click",
        (e) => {
            const n = e.srcElement.id.slice("menuItem_".length) * 1;
            if (menu.selection == n) {
                const { shiftKey, ctrlKey, altKey } = e;
                menu.dispatch({ shiftKey, ctrlKey, altKey });
            } else {
                menu.selection = n;
                menu.show();
            }
        }
    )
}

/* If we ever get enough user feedback, we might change this
   to jump more than 1 entry per scrolly
*/
mouse.scroll = (e) => {
    if (e.wheelDelta > 0) {
        //Go Up
        commander.up();
    } else {
        //Go Down
        commander.down();
    }
    return false;
}
