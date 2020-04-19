//localStorage simpler code
let localDatabase = class {

    constructor() {

        //external elements

        //internal elements

        this.set_default();
        this.triggers();
    }

    set_default() {
    }

    triggers() {
    }

    toString(val) {
        return JSON.stringify(val);
    }

    toJSON(val) {
        return JSON.parse(val);
    }

    set(val) {
        let _temp = val;
        let feedback = '';
        let store_length = Object.entries(_temp).length;

        Object.entries(_temp).forEach((elem, key) => {
            let _key = elem[0];
            let _value = elem[1];
            localStorage.setItem(_key, this.toString(_value));
            feedback += _key + ' => ' + this.toString(_value) + ((key + 1) < store_length ? ', ' : '');
        });

        //console.log('items stored: ' + feedback)
    }

    get(val) {
        let _temp = val;
        let feedback = '';
        let store_length = Object.entries(_temp).length;
        let _data = {};

        Object.entries(_temp).forEach((elem, key) => {
            let _key = elem[0];
            let _value = elem[1];
            let _res = localStorage.getItem(_key);
            feedback += _key + ' => ' + _res + ((key + 1) < store_length ? ', ' : '');

            _res = this.toJSON(_res);

            if (!(_res == null)) {
                _data[_key] = _res;
            }
        });

        //console.log('items retrieved: ' + feedback)

        return _data;
    }
}

export {
    localDatabase
};