
/* These codes were retrieved from http://www.utf8-chartable.de/unicode-utf8-table.pl ( box drawing )
 ┌─┬─┐  ╔═╦═╗
 ├─┼─┤  ╠═╬═╣
 │ │ │  ║ ║ ║
 └─┴─┘  ╚═╩═╝
*/

const glasspane = {};

glasspane.init = () => {
    // EVIL Mac Fix
    if (navigator.userAgent.has("Mac")) {
        screenParams.doublebar = '=';
        screenParams.shouldReplaceHBar = true;
    }

    let mainScreenContent = '';
    //Menu
    //Note the relative position and z-index, without this the dropdown would overlap the menu
    //and menu events would not trigger
    mainScreenContent += "<span id='menu' class='menu' style='position:relative;z-index:2'>" + ("  Left     File     Command     Options     Right").extend() + "</span>";
    mainScreenContent += "\n";

    //Box Top, missing span here !, it's below now to fill up white spots
    mainScreenContent += "<span class='border'><span id='h1'><span id='leftroot'></span><span id='riteroot'></span></span>";
    mainScreenContent += "\n";

    //Entries
    for (let counter = 0; counter < screenParams.panelheight; counter++) {
        mainScreenContent += ("║<span id='left" + counter + "' class='border'>" + " ".repeat(screenParams.panelwidth) + "</span>║");
        mainScreenContent += ("║<span id='rite" + counter + "' class='border'>" + " ".repeat(screenParams.panelwidth) + "</span>║");
        mainScreenContent += "\n";
    }

    //Box Bottom
    mainScreenContent += ("<span id='h2'>╠" + "═".repeat(screenParams.panelwidth) + "╩╩" + "═".repeat(screenParams.panelwidth) + "╣</span>");
    mainScreenContent += "\n";
    mainScreenContent += ("║<span id='url'>" + " ".repeat((screenParams.panelwidth + 1) * 2) + "</span>║");
    mainScreenContent += "\n";
    mainScreenContent += ("<span id='h3'>╚" + "═".repeat((screenParams.panelwidth + 1) * 2) + "╝" + "</span></span>");
    mainScreenContent += "\n";

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


    for (key in function_keys) {
        const f = function_keys[key];
        mainScreenContent += ("<span class='fcode'>F" + f.id + "</span><span class='menu' id='f" + f.id + "'>" + f.description + "</span><span class='fcode'> </span>");
    }
    mainScreenContent += ("<span id='end' class='fcode'>" + " ".repeat(screenParams.screenwidth - 91) + "</span>");
    mainScreenContent += "\n";

    window.mainScreen.innerHTML = mainScreenContent;
    mouse.reinit_if_already_init();
    commander.boot();

    /* EVIL Mac Fix */
    if (screenParams.shouldReplaceHBar) {
        //Replace ═ with =, cause silly Mac OS
        $("#h2").text((index, oldtext) => oldtext.replace(/═/gi, screenParams.doublebar));
        $("#h3").text((index, oldtext) => oldtext.replace(/═/gi, screenParams.doublebar));
        $("#options").text((index, oldtext) => oldtext.replace(/═/gi, screenParams.doublebar));
    }
}
