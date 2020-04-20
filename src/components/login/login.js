import { SERVER_ATTR, RENDER_SOURCE } from '../../configurations';
import { add_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../../essentials/library/library';
import { localDatabase } from '../../essentials/localDatabase/localDatabase';
import { Auth } from '../../essentials/authentication/authentication';
//import './login.scss';

let localDB = new localDatabase();
let authService = new Auth();

let Login = class { //get token from localDatabase, and display forms and pages

    constructor(view) {
        history.pushState({ login: 'loginPage1' }, 'loginPage1', `/login`);

        //external elements

        //internal elements -> this includes properties that were converted from parameters
        this.log_items = {
            userentry: '',
            password: ''
        };
        this.view = view;

        this.set_default();

        this.render();
        //this.triggers();
        //this.checkLogged();
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

        if (this.view == 'box') {
            _html = ``;
        }
        else if (this.view === undefined || this.view == 'page') {
            _html = `
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
            `;
        }

        add_html({
            element: RENDER_SOURCE,
            value: _html
        });
    }

    //methods

    //triggers
    async submitLogged () {
        await authService.gainAccess(this.log_items.userentry, this.log_items.password) //auth service
            .then(res => {
                //if (Object.keys(res.records).length == 0) throw 'Incorrect credentials entered';
                //localDB.set({ log_token: res.records.uniq });
                let dashboard = new dashboardPage();
            })
            .catch(err => {
                console.log(err);
            });
    }

    async checkLogged () {
        let userLogged = localDB.get({ log_token: 1 });

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