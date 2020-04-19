import { SERVER_ATTR, RENDER_SOURCE } from './configurations';
import { add_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from './essentials/library/library';
import { localDatabase } from './essentials/localDatabase/localDatabase';
import { Auth } from './essentials/authentication/authentication';
import { Router } from './essentials/router/router';
import { Instantiate } from './essentials/appinstantiate/appinstantiate';
import './scss/app.scss';

import { Login } from './components/login/login'

//Sub Pages
let app_functions = {
    "Login": {
        "construct": Login
    }
    /*"Invoicing": {
        "Recent Invoices": {
            "construct": RecentInvoicesPage
        },
        "Create Invoice": {
            "construct": CreateInvoicePage
        },
        "Archived Invoices": null
    }*/
};

let localDB = new localDatabase();
//let router = new Router(app_functions);
let app_instance = new Instantiate();

let dashboardPage = class { //wrapper for the app itself, that would supposedly also jumpstart the app

    constructor() {

        this.page_container_title = 'dashboard';
        this.page_container = `#${this.page_container_title}`;

        //external elements

        //internal elements
        this.trigger_elements = {};

        this.set_default();

        this.render();
        this.triggers();
    }

    triggers() {
        let root_element = document.querySelector(this.page_container);

        let trigger_click_function = async (e) => {
            let routerLink = e.target.closest('.router-link');

            if (routerLink) {
                let _body_offsetWidth = document.body.offsetWidth;
                //console.log(_body_offsetWidth);
                if (_body_offsetWidth < 993) {
                    this.trigger_elements['side navigation'].close();
                }
            }
        }

        let trigger_click = root_element.addEventListener('click', trigger_click_function);

        this.trigger_elements = {
            'trigger click': {
                event: 'click',
                action: trigger_click
            }
        }
    }

    set_default() {
    }

    render() {
        let _html = '';

        _html = `
            <a href="#" data-target="main-side-navi" class="sidenav-trigger"><i class="material-icons">menu</i></a>
            <div id="content-display" style="padding-left:300px">
            </div>
        `;

        add_html({
            element: RENDER_SOURCE,
            value: _html
        });

        this.render_navigation();
        
        app_instance.instantiate(app_functions);

    }

    render_navigation() {

        let _menu_items = '';

        Object.entries(app_functions).forEach((elem, key) => {
            let _key = elem[0];
            let _value = elem[1];
            let _temp = '';
            let _temp_sub_items = '';

            Object.entries(_value).forEach((elem_2, key_2) => {
                let _key_2 = elem_2[0];
                let _value_2 = elem_2[1];

                let _path = (() => {
                    let i = '';
                    let _arr = _key_2.split(' ');
                    _arr.forEach((elem_3, key_3) => {
                        i += elem_3.toLowerCase() + (key_3 + 1 < _arr.length ? '-' : '');
                    });
                    return i;
                })();

                _temp_sub_items += `
                    <li class="router-link menu-items${(key == 0 && key_2 == 0 ? ' active' : '')}" encoded-path="${key + '.' + key_2}"><a href="/${_path}">${_key_2}</a></li>
                `;
            });

            _temp = `
                <li ${(key == 0 ? 'class="active"' : '')}>
                    <div class="collapsible-header">${_key}</div>
                    <div class="collapsible-body">
                        <ul>
                            ${_temp_sub_items}
                        </ul>
                    </div>
                </li>`;
            _menu_items += _temp;
        });

        add_html({
            element: '#main-side-navi',
            value: _menu_items
        });
    }

    //methods

    //triggers

    //controllers

}

//INIT App
app_instance.runApp(dashboardPage);