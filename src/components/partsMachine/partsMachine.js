import { SERVER_ATTR, RENDER_SOURCE } from '../../configurations';
import { add_html, append_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../../essentials/library/library';
import './partsMachine';
import axios from 'axios';

import { localDatabase } from '../../essentials/localDatabase/localDatabase';

let localDB = new localDatabase();

let PartsMachine = class {

    constructor() {

        this.page_container_title = 'parts-machine';
        this.page_container = `#${this.page_container_title}`;

        //external elements

        //internal elements -> this includes properties that were converted from parameters
        this.trigger_elements = {};
        this.parts = [];

        this.set_default();

        this.render();
        this.triggers();

        this.getParts();
    }

    triggers() {
        let root_element = document.querySelector(this.page_container);

        let trigger_click_function = async (e) => {
            let card = e.target.closest('.card');

            if (card) {
                let _unique = card.dataset.unique;
                let _index = card.dataset.index;

                let viewDocument = e.target.closest('.view-document');
                let collectionItem = e.target.closest('.collection-item');

                if (viewDocument) {
                    this.getDocument(_unique, 'view');
                }

                if (collectionItem) {
                    this.acceptRequest(this.parts[_index]);
                }
            }
        }

        let trigger_change_function = async (e) => {
        }

        let trigger_input_function = async (e) => {
        }

        let trigger_click = root_element.addEventListener('click', trigger_click_function);
        let trigger_change = root_element.addEventListener('change', trigger_change_function);
        let trigger_input = root_element.addEventListener('input', trigger_input_function);

        this.trigger_elements = {
            'trigger click': {
                event: 'click',
                action: trigger_click
            },
            'trigger change': {
                event: 'change',
                action: trigger_change
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

        _html = `
            <div class="page-container" id="${this.page_container_title}">
                <div class="row">
                    <div class="col s12">
                        <h3>Parts List</h3>
                    </div>
                </div>

                <div class="row left-align" id="parts-list">
                </div>
            </div>
        `;

        add_html({
            element: RENDER_SOURCE,
            value: _html
        });

    }

    //methods
    renderList(list, container) {
        let _html = '';
        console.log(list)
        list.forEach((elem, key) => {
            _html += `
                <div class="col s12 m6">
                    <div class="card" data-unique="${elem._id}" data-index="${key}">
                        <div class="card-content"> <!-- --------------CARD CONTENT-------------- -->
                            <span class="card-title">Parts <b>${key + 1}</b> for ${elem.manufacturer.name}</span>
                            <span class=""><b>Status</b></span>
                            <ul class="collection">
                                <li class="collection-item">
                                    <div class="row">
                                        <div class="col s6">
                                            Send Invoice for Parts
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="card-action"> <!-- --------------CARD ACTION-------------- -->
                            <button class="waves-effect waves-light btn view-document">View Document</button>
                        </div>
                    </div>
                </div>
            `;
        });

        add_html({
            element: container,
            value: _html
        });
    }

    //triggers
    getParts() {
        this.fetchParts()
            .then(res => {
                console.log(res)
                let _parts = res.data;

                if (!res.success) throw res.error;
                if (res.count < 1) throw 'No parts are listed yet.';

                this.parts = _parts;
                this.renderList(_parts, '#parts-list');
            })
            .catch(err => {
                let _html = '';
                console.log(err);
                _html = `${err}`;
            });
    }

    acceptRequest(elem) {
        let _body = {
            id: elem._id,
            machine: elem.machine,
            document: elem.document,
            manufacturer: elem.manufacturer,
            delivery: elem.delivery
        };

        this.updateDesign(_body)
            .then(res => {
                console.log(res)
                // let _parts = res.data;

                // if (!res.success) throw res.error;
                // if (res.count < 1) throw 'No machines are listed yet.';
            })
            .catch(err => {
                let _html = '';
                console.log(err);
                _html = `${err}`;
            });
    }

    getDocument(uniq, type) {
        let url = SERVER_ATTR.PAGE_PARTS + `/${type}/${uniq}`;

        this.accessDocuments(url)
            .then(res => {
                console.log(res);
                if (res.success) {
                    window.open(`${res.data.url.data}`, "_blank");
                }
                else {
                    alert(res.data.url.comment);
                }
            })
            .catch(err => {
                let _html = '';
                console.log(err);
                _html = `${err}`;
            });
    }

    //controllers
    async fetchParts() { //fetch 
        let userLogged = localDB.get(['log_token']);
        const sendRequest = new Request(SERVER_ATTR.PAGE_PARTS, {
            method: 'GET',
            //body: body,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'auth-token': userLogged.log_token
            }
        });

        let list = await fetch(sendRequest); //fetch returns a Promise
        let data = await list.json();

        return data;
    }

    async updateDesign(val) { //update
        let userLogged = localDB.get(['log_token']);
        let body = JSON.stringify(val);
        const sendRequest = new Request(SERVER_ATTR.PAGE_PARTS, {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'auth-token': userLogged.log_token
            }
        });

        let list = await fetch(sendRequest); //fetch returns a Promise
        let data = await list.json();

        return data;
    }

    async accessDocuments(url) { //fetch document
        const sendRequest = new Request(url, {
            method: 'GET',
            //body: body,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });

        let list = await fetch(sendRequest); //fetch returns a Promise
        let data = await list.json();

        return data;
    }

}

export { PartsMachine };