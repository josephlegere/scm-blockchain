import { SERVER_ATTR, RENDER_SOURCE } from '../../configurations';

let Auth = class {

    constructor() {

        //external elements

        //internal elements

        this.set_default();

        this.triggers();
        this.checkLogged();
    }

    triggers() {
    }

    set_default() {
    }

    render() {
        let _html = '';

        _html = `
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
                });
        }
        else {
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

export { Auth };