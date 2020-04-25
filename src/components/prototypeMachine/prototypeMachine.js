import { SERVER_ATTR, RENDER_SOURCE } from '../../configurations';
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
        this.machine = {
            "machine_item": "",
            "quantity": null,
            "customer": {
                "id": null,
                "name": ""
            }
        };

        this.set_default();

        this.render();
        this.triggers();

        this.getMachines();
    }

    triggers() {
        let root_element = document.querySelector(this.page_container);

        let trigger_click_function = async (e) => {
            let submitForm = e.target.closest('#submit-form');
            let modalOpen = e.target.closest('.modal-open');

            if (submitForm) {
                console.log(this.machine)
                let _empty_elements = {};
                let _details = {};

                try {
                    let _excempt = [];
                    let _details = Object.assign({}, this.machine_details, this.machine_particulars_details);

                    Object.entries(this.machine).forEach(elem => { //retrieve blank elements
                        let _key = elem[0];
                        let _value = elem[1];

                        if ((_value == null || _value == 0) && !(_excempt.includes(_key))) _empty_elements[_key] = _value;
                    });

                    //if (Object.keys(_empty_elements).length > 0) throw { elements: _empty_elements, details: _details };

                    this.submitForm();
                }
                catch (err) {
                    console.log(err)
                    let _html = '';
                    let _elements = err.elements;
                    let _details = err.details;
                    _html = `Some elements has no value: ${_elements}`;

                    if (typeof _elements === 'object') {
                        let _temp = '';

                        Object.keys(_elements).forEach((elem, key) => {
                            _temp += `${(key == 0 ? '' : ',<br>') + _details[elem].display}`;
                        });
                        _html = `Elements:<br>${_temp}<br>has no value.`;
                    }

                    M.toast({
                        html: _html,
                        classes: 'red accent-4'
                    });
                }
            }

            if (modalOpen) {
                this.trigger_elements['page modal'].open();
            }
        }

        let trigger_change_function = async (e) => {
            let formSelectItem = e.target.closest('.form-select-item');

            if (formSelectItem) {
                let _property = formSelectItem.dataset.property;
                let _value = formSelectItem.value;
                this.machine[_property] = _value;
            }
        }

        let trigger_input_function = async (e) => {
            let formInputItem = e.target.closest('.form-input-item');

            if (formInputItem) {
                let _property = formInputItem.dataset.property;
                let _value = formInputItem.value;

                this.machine[_property] = _value;

                if (_property == 'item') {
                    this.machine.itemcode = null;
                    clearTimeout(this.timers.items);
                    this.timers.items = setTimeout(() => {
                        this.suggestItems(_value, 'items', (this.machine.itemtype ? this.machine.itemtype : null));
                    }, 1000);
                }
            }
        }

        let trigger_click = root_element.addEventListener('click', trigger_click_function);
        let trigger_change = root_element.addEventListener('change', trigger_change_function);
        let trigger_input = root_element.addEventListener('input', trigger_input_function);

        let machine_select = document.querySelector('#item-types');
        let machine_instance_select = M.FormSelect.init(machine_select, {});

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
            'machine': machine_instance_select,
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
            </div>
            
            <div id="page-modal" class="modal">
                <div class="modal-content">
                    <iframe>
                    </iframe>
                </div>
                <div class="modal-footer">
                    <button class="modal-close waves-effect waves-green btn-flat">Agree</button>
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
                    <div class="card">
                        <div class="card-content"> <!-- --------------CARD CONTENT-------------- -->
                            <span class="card-title"><b>${elem.machine_item}</b> for ${elem.customer.name}</span>
                            <ul class="collection">
                                <li class="collection-item">
                                    <div class="row">
                                        <div class="col s6">
                                            Design
                                        </div>
                                        <div class="col s6 right-align">
                                            <i class="material-icons ${(elem.hasOwnProperty('design') && elem.design.length > 0 ? `green-text text-darken-1` : 'red-text text-darken-1')}">lens</i>
                                        </div>
                                    </div>
                                </li>
                                <li class="collection-item">
                                    <div class="row">
                                        <div class="col s6">
                                            Product Parts
                                        </div>
                                        <div class="col s6 right-align">
                                            <i class="material-icons ${(elem.hasOwnProperty('parts') && elem.parts.length > 0 ? `green-text text-darken-1` : 'red-text text-darken-1')}">lens</i>
                                        </div>
                                    </div>
                                </li>
                                <li class="collection-item">
                                    <div class="row">
                                        <div class="col s6">
                                            Deliver
                                        </div>
                                        <div class="col s6 right-align">
                                            <i class="material-icons ${(elem.hasOwnProperty('deliver') && elem.deliver.length > 0 ? `green-text text-darken-1` : 'red-text text-darken-1')}">lens</i>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <p>Notes: ${(elem.hasOwnProperty('notes') ? `${elem.notes}` : 'n/a')}</p>
                        </div>
                        
                        <div class="card-action"> <!-- --------------CARD ACTION-------------- -->
                            <button class="waves-effect waves-light btn modal-open">Modal</button>
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
    getMachines() {
        let _body = '';

        this.fetchMachines(_body)
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

    //controllers
    async fetchMachines(value) { //fetch clients and companies
        let userLogged = localDB.get(['log_token']);
        const body = JSON.stringify(value);
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


}

export { PrototypeMachine };