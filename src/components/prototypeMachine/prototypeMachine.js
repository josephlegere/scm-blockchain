import { SERVER_ATTR, URL_SERVER, RENDER_SOURCE } from '../../configurations';
import { add_html, append_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../../essentials/library/library';
import './prototypeMachine.scss';
import axios from 'axios';

import { localDatabase } from '../../essentials/localDatabase/localDatabase';

let localDB = new localDatabase();

let PrototypeMachine = class {

    constructor() {

        this.page_container_title = 'prototype-machine';
        this.page_container = `#${this.page_container_title}`;

        //external elements

        //internal elements -> this includes properties that were converted from parameters
        this.trigger_elements = {};
        this.machines = [];
        this.form = {};
        this.form_process = '';

        this.set_default();

        this.render();
        this.triggers();

        this.getMachines();
    }

    triggers() {
        let root_element = document.querySelector(this.page_container);

        let trigger_click_function = async (e) => {
            let modalContent = e.target.closest('.modal-content');
            let card = e.target.closest('.card');
            
            if (modalContent) {
                let submitForm = e.target.closest('#submit-form');
                if (submitForm) {
                    console.log(this.form)

                    try {
                        this.addProcessRequest();
                    }
                    catch (err) {
                        console.log(err)

                        M.toast({
                            html: err,
                            classes: 'red accent-4'
                        });
                    }
                }
            }

            if (card) {
                let _unique = card.dataset.unique;
                let _design = card.dataset.design;
                let _parts = card.dataset.parts;
                let _delivery = card.dataset.delivery;

                let viewDocument = e.target.closest('.view-document');
                let machineDesign = e.target.closest('.machine-design');
                let machineParts = e.target.closest('.machine-parts');
                let machineDeliver = e.target.closest('.machine-deliver');

                if (viewDocument) {
                    this.getDocument(_unique, 'machines', 'view');
                    //document.getElementById('document-viewer').setAttribute('src', 'http://localhost:5000/public/uploads/5ea2e38a89397a5ad9b3bd64/1587917956117_machine.xml');
                    //this.trigger_elements['page modal'].open();
                    //window.open("http://localhost:5000/public/uploads/5ea2e38a89397a5ad9b3bd64/1587917956117_machine.xml", "_blank")
                }
                else if (machineDesign) {
                    let _unique_design = machineDesign.dataset.unique;
                    if (_design === 'none') {
                        this.render_designRequest(_unique);
                        this.trigger_elements['page modal'].open();
                    }
                    else {
                        this.getDocument(_unique_design, 'designs', 'view');
                    }
                }
                else if (machineParts) {
                    let _unique_parts = machineParts.dataset.unique;
                    if (_parts === 'none') {
                        this.render_partsRequest(_unique);
                        this.trigger_elements['page modal'].open();
                    }
                    else {
                        this.getDocument(_unique_parts, 'parts', 'view');
                    }
                }
            }
        }

        let trigger_change_function = async (e) => {
            let formSelectItem = e.target.closest('.form-select-item');

            if (formSelectItem) {
                let _property = formSelectItem.dataset.property;
                let _value = formSelectItem.value;
                this.form[_property] = _value;
            }
        }

        let trigger_input_function = async (e) => {
            let formInputItem = e.target.closest('.form-input-item');

            if (formInputItem) {
                let _property = formInputItem.dataset.property;
                let _value = formInputItem.value;

                this.form[_property] = _value;
            }
        }

        let trigger_click = root_element.addEventListener('click', trigger_click_function);
        let trigger_change = root_element.addEventListener('change', trigger_change_function);
        let trigger_input = root_element.addEventListener('input', trigger_input_function);

        let pageModal = document.querySelector('#page-modal');
        let pageModal_instance = M.Modal.init(pageModal, {});

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
            },
            'page modal': pageModal_instance
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
                        <h3>Prototype List</h3>
                    </div>
                </div>

                <div class="row left-align" id="prototype-list">
                </div>
                
                <div id="page-modal" class="modal">
                    <div class="modal-header">
                        <button class="modal-close waves-effect waves-green btn-flat right">Close</button>
                    </div>
                    <div class="modal-content">
                    </div>
                </div>
            </div>
        `;

        add_html({
            element: RENDER_SOURCE,
            value: _html
        });

    }

    //methods
    renderList (list, container) {
        let _html = '';
        console.log(list)
        list.forEach(elem => {
            _html += `
                <div class="col s12 m6">
                    <div class="card" data-unique="${elem._id}" data-design="${(elem.hasOwnProperty('design') ? `pending` : 'none')}" data-parts="${(elem.hasOwnProperty('parts') && elem.parts.hasOwnProperty('id') ? `pending` : 'none')}" data-delivery="">
                        <div class="card-content"> <!-- --------------CARD CONTENT-------------- -->
                            <span class="card-title"><b>${elem.machine_item}</b> for ${elem.customer.name}</span>
                            <ul class="collection">
                                <li class="collection-item machine-design" data-unique="${(elem.hasOwnProperty('design') ? `${elem.design.id}` : '')}">
                                    <div class="row">
                                        <div class="col s6">
                                            Design
                                        </div>
                                        <div class="col s6 right-align">
                                            <i class="material-icons ${(elem.hasOwnProperty('design') ? `green-text text-darken-1` : 'red-text text-darken-1')}">lens</i>
                                        </div>
                                    </div>
                                </li>
                                <li class="collection-item machine-parts" data-unique="${(elem.hasOwnProperty('parts') && elem.parts.hasOwnProperty('id') ? `${elem.parts.id}` : '')}">
                                    <div class="row">
                                        <div class="col s6">
                                            Product Parts
                                        </div>
                                        <div class="col s6 right-align">
                                            <i class="material-icons ${(elem.hasOwnProperty('parts') && elem.parts.hasOwnProperty('id') ? `green-text text-darken-1` : 'red-text text-darken-1')}">lens</i>
                                        </div>
                                    </div>
                                </li>
                                <li class="collection-item machine-deliver">
                                    <div class="row">
                                        <div class="col s6">
                                            Deliver
                                        </div>
                                        <div class="col s6 right-align">
                                            <i class="material-icons ${(elem.hasOwnProperty('deliver') ? `green-text text-darken-1` : 'red-text text-darken-1')}">lens</i>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <p>Quantity: <b>${elem.quantity} Units</b></p>
                            <p>Notes: ${(elem.hasOwnProperty('notes') ? `<b>${elem.notes}</b>` : 'n/a')}</p>
                        </div>
                        
                        <div class="card-action"> <!-- --------------CARD ACTION-------------- -->
                            <button class="waves-effect waves-light btn view-document">View Request</button>
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

    render_designRequest (id) {
        let _html = '';
        this.form = {
            'functionality': '',
            'appearance': '',
            'content': '',
            'materials': '',
            'size': '',
            'machine': id
        }
        this.form_process = 'designs';

        _html = `
            <div class="row center">
                <div class="col s12">
                    <h4>
                        <div>Design</div>
                    </h4>
                </div>
            </div>

            <div class="row">
                <form class="col s12 center">

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="functionality" type="text" class="form-input-item" data-property="functionality">
                            <label for="functionality">Functionality</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="appearance" type="text" class="form-input-item" data-property="appearance">
                            <label for="appearance">Appearance</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="content" type="text" class="form-input-item" data-property="content">
                            <label for="content">Content</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="materials" type="text" class="form-input-item" data-property="materials">
                            <label for="materials">Materials</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="size" type="number" class="form-input-item" min="0" data-property="size">
                            <label for="size">Size</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 offset-m2 m8">
                            <a class="waves-effect waves-light btn right" id="submit-form">Submit Design</a>
                        </div>
                    </div>

                </form>
            </div>
        `;

        add_html({
            element: '.modal-content',
            value: _html
        });
    }

    render_partsRequest (id) {
        let _html = '';
        this.form = {
            'amount': '',
            'parts': ['Part 1', 'Part 2'],
            'schedule': '',
            'location': '',
            'machine': id
        }
        this.form_process = 'parts';

        _html = `
            <div class="row center">
                <div class="col s12">
                    <h4>
                        <div>Design</div>
                    </h4>
                </div>
            </div>

            <div class="row">
                <form class="col s12 center">

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="amount" type="number" class="form-input-item" min="0" data-property="amount">
                            <label for="amount">Amount</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 m2"></div>
                        <div class="col s12 m8">
                            <ul class="collection with-header">
                                <li class="collection-header"><h5>Parts</h5></li>
                                <li class="collection-item">
                                    Part 1
                                </li>
                                <li class="collection-item">
                                    Part 2
                                </li>
                            </ul>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="schedule" type="text" class="form-input-item" data-property="schedule">
                            <label for="schedule">Delivery Schedule</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 m2"></div>

                        <div class="input-field col s12 m8">
                            <input placeholder="" id="location" type="text" class="form-input-item" data-property="location">
                            <label for="location">Delivery Location</label>
                        </div>
                        <div class="col s12 m2"></div>
                    </div>

                    <div class="row">
                        <div class="col s12 offset-m2 m8">
                            <a class="waves-effect waves-light btn right" id="submit-form">Submit Parts</a>
                        </div>
                    </div>

                </form>
            </div>
        `;

        add_html({
            element: '.modal-content',
            value: _html
        });
    }

    //triggers
    getMachines() {
        this.fetchMachines()
            .then(res => {
                console.log(res)
                let _machines = res.data;

                if (!res.success) throw res.error;
                if (res.count < 1) throw 'No machines are listed yet.';

                this.renderList(_machines, '#prototype-list');
            })
            .catch(err => {
                let _html = '';
                console.log(err);
                _html = `${err}`;
            });
    }

    getDocument(uniq, process, action) {
        let url = URL_SERVER + `${process}/${action}/${uniq}`;

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

    addProcessRequest() {
        append_html({
            element: RENDER_SOURCE,
            value: renderPreLoader(true, true)
        });

        let url = URL_SERVER + `${this.form_process}`;

        this.insertProcessRequest(url, this.form)
            .then(res => {
                remove_element({ value: '.loading-wrapper' })
                console.log(res);
                let data = res.data;

                if (!res.success) throw { incomplete: data };

                M.toast({
                    html: 'You have successfully submitted the voucher!',
                    classes: 'green accent-4'
                });
            })
            .catch(err => {
                remove_element({ value: '.loading-wrapper' })
                let _html = '';
                console.log(err);
                _html = `${err}`;
            });
    }

    //controllers
    async fetchMachines() { //fetch clients and companies
        let userLogged = localDB.get(['log_token']);
        const sendRequest = new Request(SERVER_ATTR.PAGE_MACHINE, {
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

    async insertProcessRequest(url, body) {
        let userLogged = localDB.get(['log_token']);
        let _body = JSON.stringify(body);
        const sendRequest = new Request(url, {
            method: 'POST',
            body: _body,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'auth-token': userLogged.log_token
            }
        });

        let list = await fetch(sendRequest); //fetch returns a Promise
        let data = await list.json();

        return data;
    }
}

export { PrototypeMachine };