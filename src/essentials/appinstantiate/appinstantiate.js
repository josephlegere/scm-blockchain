//import { add_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../library/library.js';

let Instantiate = class {

    constructor() {

        //external elements
        this.app_instance = null;
        this.app_functions = null;

        //internal elements
        this.trigger_elements = {};

        this.set_default();

        this.render();
        this.triggers();
    }

    triggers() {
    }

    set_default() {
    }

    render() {
    }

    runApp(_instance) {
        this.app_instance = _instance;
        let app = new this.app_instance();
    }

    instantiate(_functions) {
        this.app_functions = _functions;
        let _initial_page = Object.values(this.app_functions)[0];
        let _initial_page_key = Object.keys(_initial_page)[0];
        let _initial_page_class = _initial_page.construct;
        history.pushState({
            recentInvoices: this.name_to_title(_initial_page_key),
            code: '0'
        },
            this.name_to_title(_initial_page_key),
            `${window.location.origin}/${this.name_to_path(_initial_page_key)}`);

        return new _initial_page_class();
    }

    name_to_path(val) {
        let i = '';
        let _arr = val.split(' ');
        _arr.forEach((elem, key) => {
            i += elem.toLowerCase() + (key + 1 < _arr.length ? '-' : '');
        });
        return i;
    }

    name_to_title(val) {
        let i = '';
        let _arr = val.split(' ');

        _arr.forEach((elem, key) => {
            if (key == 0) i += elem.toLowerCase();
            else i += elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase();
        });

        return i;
    }

    //methods

    //triggers

    //controllers

}

export { Instantiate };