/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

keyboard
    .addMapping(viewer)
    .add('F1', commander.help)
    .add('F3', commander.view)
    .add('F10', commander.view)
    .add('Escape', commander.view)
    .add('F5', commander.view)
    .add('Tab', () => { })
    ;

keyboard
    .addMapping(editor)
    .add('F1', commander.help)
    .add('F2', editor.save)
    .add('F3', editor.quit)
    .add('F4', editor.quit)
    .add('Escape', editor.quit)
    .add('F5', editor.test)
    .add('F10', editor.quit)
    ;

keyboard
    .addMapping(menu)
    .add('ArrowLeft', menu.goLeft)
    .add('ArrowRight', menu.goRight)
    .add('ArrowUp', menu.goUp)
    .add('ArrowDown', menu.goDown)
    .add('Enter', menu.dispatch)
    .add('Ctrl+Enter', menu.dispatch)
    .add('Escape', menu.exit)
    .add('F9', menu.exit)
    .add('Tab', () => { })
    ;

keyboard
    .addMapping(commander)
    .add('Backspace', commander.back)
    .add('Tab', commander.swapPanel)
    .add('ArrowLeft', commander.swapPanel)
    .add('ArrowRight', commander.swapPanel)
    .add('Enter', commander.delve)
    .add('Space', commander.delve)
    .add('PageUp', commander.pageUp)
    .add('PageDown', commander.pageDown)
    .add('ArrowUp', commander.up)
    .add('ArrowDown', commander.down)
    .add('Shift+ArrowUp', commander.moveUp)
    .add('Shift+ArrowDown', commander.moveDown)
    .add('Home', commander.home)
    .add('End', commander.end)
    .add('*', commander.selector)
    .add('F1', commander.help)
    .add('F2', commander.equalize)
    .add('F3', commander.view)
    .add('F4', commander.edit)
    .add('F5', commander.copy)
    .add('F6', commander.move)
    .add('F7', commander.createFolder)
    .add('F8', commander.delete)
    .add('F9', commander.menu)
    .add('F10', commander.quit)
    .add('+', commander.moveUp)
    .add('-', commander.moveDown)
    .add('/', commander.filter)
    ;

keyboard
    .addMapping(options)
    .add('Escape', options.cancel)
    .add('Enter', options.validate)
    .add('Space', () => options.activate())
    .add('ArrowLeft', options.goPrev)
    .add('ArrowRight', options.goNext)
    .add('ArrowUp', options.goPrev)
    .add('ArrowDown', options.goNext)
    .add('Tab', options.goNext)
    ;


