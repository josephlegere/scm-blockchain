import { SERVER_ATTR } from '../../configurations';
import axios from 'axios';

let Auth = class { //Auth is only for authenticating this client to the remote server

    constructor() {

        //external elements

        //internal elements

        this.set_default();
    }

    set_default() {
    }

    //methods

    //triggers
    //passing tokens with the server url provided in the configurations
    //convert credentials to token
    //get_token () {} //get token in server <- verifyLogged
    //compare_token {} //compare token in server <- verifyLogged
    //combine checkLogged and verifyLogged

    gainAccess(userEntry, password) {
        return new Promise((resolve, reject) => {
            let user = {
                deviceEntry: 'web', //device entry e.g. web, mobile, desktop
                email: userEntry,
                password: password
            };

            const res = axios.post(SERVER_ATTR.PAGE_LOGIN, user, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(function (res) {
                    // handle success
                    console.log(res);
                    resolve(res.data); //token verified and returned
                })
                .catch(function (err) {
                    // handle error
                    console.log(err);
                    reject('Unable to gain access!');
                })
                .then(function () {
                    // always executed
                });
        });
    }

    verifyAccess(token) {
        return new Promise ((resolve, reject) => {
            let _body = {
                deviceEntry: 'web', //device entry e.g. web, mobile, desktop
                tkn: token
            }

            this.getLog(_body)
                .then(res => {
                    resolve(true); //token verified and is available
                })
                .catch(err => {
                    reject('Unable to verify access!');
                });
        });
    }

    //controllers
    async getLog(value) {
        const body = JSON.stringify(value);
        const sendRequest = new Request(SERVER_ATTR.PAGE_LOGIN, {
            method: 'GET',
            body: body,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        console.log(sendRequest)

        let list = await fetch(sendRequest); //fetch returns a Promise
        let data = await list.json();

        return data;
    }

}

export { Auth };