/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

mouse = {};


/* Some DRYness*/
const bindTopMenu = (_menu) => {
    const top = $("#menu")[0];

    top.innerHTML = top.innerHTML.replace(_menu.caption, '<span class="menuItem" id="menu_' + _menu.caption + '">' + _menu.caption + '</span>');
    $("#menu_" + _menu.caption).live("click", () => {
        menu.current = _menu;
        menu.selection = 0;
        commander.menu();
    });
}

mouse.init = () => mouse.reinit();

mouse.reinit_if_already_init = () => {
    if (mouse._is_init) {
        mouse.reinit();
    }
}

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

            if (screenParams.simpleClickOnSelectedItemDelve) {
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
                    if (screenParams.simpleClickOnSelectedItemDelve) {
                        onClick();
                    }
                }, screenParams.doubleClickTimeout),
                onClick,
            }
        }
    };
})();

mouse.reinit = () => {
    if (!mouse._is_init) {
        //We go for each item and give it a mouse click event listener
        //Note the very cool 'live' which means listener also counts for newly created divs
        //which happens all the time in bookmark commander
        //if an item was already clicked then we assume the user wants to execute it (delve)
        for (let i = 0; i < screenParams.panelheight; i++) {
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
    }

    //Do the top menu
    //This is a fairly nasty piece of hacking ;\
    //To redeem myself I will make it i18n friendly

    bindTopMenu(menu.left);
    bindTopMenu(menu.file);
    bindTopMenu(menu.command);
    bindTopMenu(menu.options);
    bindTopMenu(menu.right);

    if (!mouse._is_init) {
        //Do the actual menu items, which have a very imaginative id system ( 0 -> panelheight -1 )

        for (let i = 0; i < screenParams.panelheight; i++) {
            $("#" + i).live("click",
                (e) => {
                    const n = e.srcElement.id * 1;
                    if (menu.selection == n) {
                        menu.dispatch(e);
                    } else {
                        menu.selection = n;
                        menu.show();
                    }
                }
            )
        }

        //Do the glasspane
        $("#glasspane").live("click", (e) => true);
    }
    mouse._is_init = true;
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
