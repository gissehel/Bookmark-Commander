$(document).ready(function () {
    initMainSreen();

    options.reload();

    commander.boot()
    menu.init();

    /* EVIL Mac Fix */
    if (navigator.userAgent.has("Mac")) {
        //Replace ═ with =, cause silly Mac OS
        $("#h2").text(function (index, oldtext) { return oldtext.replace(/═/gi, "=") });
        $("#h3").text(function (index, oldtext) { return oldtext.replace(/═/gi, "=") });
        $("#options").text(function (index, oldtext) { return oldtext.replace(/═/gi, "=") });
    }

    keyboard.init();
    mouse.init();

    commander.mapping_builder.activate();
});
