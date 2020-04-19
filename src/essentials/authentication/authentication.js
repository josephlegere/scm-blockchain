import { SERVER_ATTR, RENDER_SOURCE, today, days, months } from '../../configurations.js';
import { PrintDoc } from '../printDoc/printDoc.js';
import { add_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../library/library.js';
import { localDatabase } from '../localDatabase/localDatabase.js';

let localDB = new localDatabase();

let Login = class {

    constructor() {
        history.pushState({ login: 'loginPage1' }, 'loginPage1', `/login`);

        //external elements

        //internal elements
        this.log_items = {
            userentry: '',
            password: ''
        };

        this.set_default();

        this.triggers();
        this.checkLogged();
    }

    triggers() {
        let trigger_1 = document.body.addEventListener('click', (e) => {
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

        let trigger_2 = document.body.addEventListener('input', (e) => {
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
    }

    set_default() {
    }

    render() {
        let _html = '';

        _html = `
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
        `;

        add_html({
            element: RENDER_SOURCE,
            value: _html
        });
    }

    //methods

    //triggers
    submitLogged() {
        let _body = {
            dskEntry: 1,
            ue: this.log_items.userentry,
            pw: this.log_items.password
        };

        this.verifylogged(_body)
            .then(res => {
                if (Object.keys(res.records).length == 0) throw 'Incorrect credentials entered';
                localDB.set({ log_token: res.records.uniq });
                let dashboard = new dashboardPage();
            })
            .catch(err => {
                console.log(err);
            });
    }

    checkLogged() {
        let userLogged = localDB.get({ log_token: 1 });

        if (!(Object.keys(userLogged).length === 0)) {
            let _body = {
                dskEntry: 1,
                tkn: userLogged.log_token
            };

            this.verifylogged(_body)
                .then(res => {
                    let dashboard = new dashboardPage();
                })
                .catch(err => {
                    console.log(err);
                    this.render();
                });
        }
        else {
            this.render();
        }
    }

    //controllers
    async verifylogged(value) {
        const body = JSON.stringify(value);
        const sendRequest = new Request(SERVER_ATTR.PAGE_LOGIN, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });

        let list = await fetch(sendRequest); //fetch returns a Promise
        let data = await list.json();

        return data;
    }

}

export { Login };