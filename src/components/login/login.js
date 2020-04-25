import { SERVER_ATTR, RENDER_SOURCE } from '../../configurations';
import { add_html, append_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../../essentials/library/library';
import './login.scss';

import { localDatabase } from '../../essentials/localDatabase/localDatabase';
import { Auth } from '../../essentials/authentication/authentication';

let localDB = new localDatabase();
let authService = new Auth();

let Login = class { //get token from localDatabase, and display forms and pages

    constructor(view, mainpage) {

        history.pushState({ login: 'loginPage1' }, 'loginPage1', `/login`);
        this.page_container_title = 'login';
        this.page_container = `#${this.page_container_title}`;

        //external elements
        this.main = mainpage;

        //internal elements -> this includes properties that were converted from parameters
        this.log_items = {
            userentry: '',
            password: ''
        };
        this.view = view;

        this.set_default();

        this.render();
        this.triggers();
        //this.checkLogged();
    }

    triggers() {
        let root_element = document.querySelector(this.page_container);

        let trigger_click_function = document.body.addEventListener('click', (e) => {
            let loginSubmit = e.target.closest('#login-submit');

            if (loginSubmit) {
                try {
                    if (document.getElementById('userentry').value == '') throw 'Input something in the Email';
                    if (document.getElementById('password').value == '') throw 'Input something in the Password';
                    this.submitLogged();
                }
                catch (err) {
                    console.log(err);
                }
            }
        });

        let trigger_input_function = document.body.addEventListener('input', (e) => {
            let logInfo = e.target.closest('.log-info');

            if (logInfo) {
                let _id = logInfo.getAttribute('id');
                let _value = logInfo.value;

                try {
                    this.log_items[_id] = _value;
                }
                catch (err) {
                    console.log(err);
                }
            }
        });

        let trigger_click = root_element.addEventListener('click', trigger_click_function);
        let trigger_input = root_element.addEventListener('input', trigger_input_function);

        this.trigger_elements = {
            'trigger click': {
                event: 'click',
                action: trigger_click
            },
            'trigger input': {
                event: 'input',
                action: trigger_input
            }
        }
    }

    set_default() {
    }

    render() {
        let _html = '';

        if (this.view == 'box') {
            _html = ``;
        }
        else if (this.view === undefined || this.view === null || this.view == 'page') {
            _html = `
                <div class="page-container" id="${this.page_container_title}">
                    <br><br>
                    <div class="row" id="login-container">
                        <form class="col s12">
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="userentry" type="email" class="log-info">
                                    <label for="userentry">Username / Email</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="password" type="password" class="log-info">
                                    <label for="password">Password</label>
                                </div>
                            </div>
                            <a class="waves-effect waves-light btn-large" id="login-submit">Sign In</a>
                        </form>
                    </div>
                </div>
            `;
        }

        add_html({
            element: RENDER_SOURCE,
            value: _html
        });
    }

    //methods

    //triggers
    async submitLogged() {

        append_html({
            element: RENDER_SOURCE,
            value: renderPreLoader(true, true)
        });

        await authService.gainAccess(this.log_items.userentry, this.log_items.password) //auth service
            .then(tkn => {
                remove_element({ value: '.loading-wrapper' })
                console.log(tkn)
                //if (Object.keys(tkn.records).length == 0) throw 'Incorrect credentials entered';
                localDB.set({ log_token: tkn });
                let dashboard = new this.main();
            })
            .catch(err => {
                remove_element({ value: '.loading-wrapper' })
                console.log(err);
            });
    }

    async checkLogged () {
        let userLogged = localDB.get(['log_token']);

        if (!(Object.keys(userLogged).length === 0)) {

            await authService.verifyAccess(userLogged.log_token)
                .then(res => { //token verified
                    let dashboard = new dashboardPage();
                })
                .catch(err => {
                    console.log(err);
                });
        }
        else {
            console.log('Enter credentials first!');
        }
    }

}

export { Login };