class KeyboardMappingBuilder {
    constructor() {
        this._mapping = {};
    }

    get mapping() {
        return this._mapping;
    }

    activate() {
        keyboard.key_mapping = this.mapping;
    }

    add(key, code) {
        this._mapping[key] = code;
        return this;
    }
}
