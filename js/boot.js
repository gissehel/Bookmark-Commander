readyPromise.then(() => {
    dualPanel.init();
    dataAccess.init();
    menu.init();
    keyboard.init();
    mouse.init();
    commander.key_mapping_builder.activate();
})

