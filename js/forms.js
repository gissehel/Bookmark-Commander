const makeWriter = (name) => (value) => console.log(`Writing ${name} with value : [${value}]`);

options
    .newForm('p', 'Popup')
    .addGroup('Group 1')
    .addCheckbox('Choice 1', () => true, makeWriter('Choice 1'))
    .addCheckbox('Choice 2', () => false, makeWriter('Choice 2'))
    .addCheckbox('Choice 3', () => true, makeWriter('Choice 3'))
    .endGroup()
    .addGroup('Group 2')
    .addCheckbox('Choice 4', () => false, makeWriter('Choice 4'))
    .addCheckbox('Choice 5', () => true, makeWriter('Choice 5'))
    .addCheckbox('Choice 6', () => true, makeWriter('Choice 6'))
    .endGroup()
    .register(options)
    ;

options
    .newForm('q', 'Popup izpue fziup zpf')
    .addGroup('Group 1')
    .addCheckbox('Choice 1', () => true, makeWriter('Choice 1'))
    .addCheckbox('Choice 2', () => false, makeWriter('Choice 2'))
    .addCheckbox('Choice 3', () => false, makeWriter('Choice 3'))
    .addCheckbox('Choice 4', () => true, makeWriter('Choice 4'))
    .addCheckbox('Choice 5', () => true, makeWriter('Choice 5'))
    .endGroup()
    .addGroup('Group 2 zepoifu zepfi fezp')
    .addCheckbox('Choice 2', () => true, makeWriter('Choice 2"'))
    .addCheckbox('Choice 3x ozif pozefi pezofix', () => true, makeWriter('Choice 3"'))
    .addCheckbox('Choice 4', () => true, makeWriter('Choice 4"'))
    .addCheckbox('Choice 5', () => false, makeWriter('Choice 5"'))
    .addCheckbox('Choice 6', () => true, makeWriter('Choice 6"'))
    .endGroup()
    .register(options)
    ;

options
    .newForm('options', 'Options')
    .addGroup(null)
    .addCheckbox('Double click to activate', () => (!data.simpleClickOnSelectedItemToActivate), (value) => { dataAccess.simpleClickOnSelectedItemToActivate(!value) })
    .endGroup()
    .register(options)
    ;

options
    .newForm('about', 'About')
    .addGroup(null)
    .addLabel(' Orthodox Bookmark Manager ')
    .addLabel(() => ` Version ${commander.getVersion()} `)
    .addLabel('')
    .addButton('Help', commander.help)
    .endGroup()
    .disableCancel()
    .register(options)
    ;
