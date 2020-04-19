import { SERVER_ATTR, RENDER_SOURCE, today, days, months } from '../../configurations.js';
import { PrintDoc } from '../printDoc/printDoc.js';
import { add_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../library/library.js';
import { localDatabase } from '../localDatabase/localDatabase.js';

let Router = class {

    constructor(functions) {
        //created callback

        //external elements

        //internal elements
        this.triggers();
        this.app_functions = functions;

    }

    triggers() {
        console.log('Router')

        let trigger_1 = document.body.addEventListener('click', (e) => {
            let routerLink = e.target.closest('.router-link');

            if (routerLink) {
                e.preventDefault();

                //remove active-class of previous page
                let _previous_page = document.querySelectorAll('.router-link.active');
                _previous_page.forEach(elem => {
                    elem.classList.remove('active');
                });

                let _link = routerLink.querySelectorAll('a')[0];
                let _path = _link.getAttribute('href');
                let _encoded_path = routerLink.getAttribute('encoded-path');
                routerLink.classList.add('active');

                history.pushState({
                    page: this.path_to_title(_path),
                    code: _encoded_path
                },
                    this.path_to_title(_path),
                    `${window.location.origin + _path}`);

                let _functions = this.app_functions;

                let _page = this.decode_path(_functions, _encoded_path);
                let current_page = new _page();
            }
        });
        //console.log(Object.values(Object.values(app_functions)[0])[0].construct)

        window.onpopstate = (e) => {
            let _encoded_path = e.state.code;
            let _functions = this.app_functions;
            
            let _page = this.decode_path(_functions, _encoded_path);
            let current_page = new _page();
        }
    }

    //functions
    go(url) {
        window.history.pushState(null, null, url);
        return this._onChanged();
    }

    attachedCallback() {
        window.addEventListener('popstate', this._onChanged);
        this._clearRoutes();
        this._addRoutes();
        this._onChanged();
    }

    detachedCallback() {
        window.removeEventListener('popstate', this._onChanged);
    }

    name_to_path(val) {
        let i = '';
        let _arr = val.split(' ');
        _arr.forEach((elem, key) => {
            i += elem.toLowerCase() + (key + 1 < _arr.length ? '-' : '');
        });
        return i;
    }

    path_to_title(val) {
        let i = '';
        let _str = val.replace('/', '');
        let _arr = _str.split('-');
        _arr.forEach((elem, key) => {
            if (key == 0) i += elem.toLowerCase();
            else i += elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase();
        });
        return i;
    }

    value_from_code(obj, index) {
        let _arr = Object.values(obj);
        return _arr[index];
    }

    decode_path(paths, code) {
        let _encode = code;
        let _functions = paths;
        let _path = '';
        let _arr = _encode.split('.');

        _arr.forEach((elem, key) => { //every iteration moves into an object, regardless of being inner or outer
            _functions = this.value_from_code(_functions, elem);
        });

        _path = _functions.construct;
        return _path;
    }

    //methods

    //triggers

    //controllers

}

export { Router };