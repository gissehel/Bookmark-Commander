readyPromise.then(() => {
    dualPanel.init();
    dataAccess.init();
    keyboard.init();
    mouse.init();
    options.init();
    shortcutBar.init();
    menu.init();
    combo.init();
    commander.context.activate();
})
