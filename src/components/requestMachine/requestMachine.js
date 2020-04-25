import { SERVER_ATTR, RENDER_SOURCE } from '../../configurations';
import { add_html, append_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../../essentials/library/library';
import './requestMachine.scss';
import axios from 'axios';

import { localDatabase } from '../../essentials/localDatabase/localDatabase';

let localDB = new localDatabase();

let RequestMachine = class {

    constructor() {

        this.page_container_title = 'request-machine';
        this.page_container = `#${this.page_container_title}`;

        //external elements

        //internal elements -> this includes properties that were converted from parameters
        this.trigger_elements = {};
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
    }

    triggers() {
        let root_element = document.querySelector(this.page_container);

        let trigger_click_function = async (e) => {
            let submitForm = e.target.closest('#submit-form');

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
            'machine': machine_instance_select
        }
    }

    set_default() {
    }

    render() {
        let _html = '';

        _html = `
            <div class="page-container" id="${this.page_container_title}">
                <div class="row">
                    <div class="col s12 right-align">
                        <b><span id="form-date">(date)</span></b>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col s12">
                        <h6>
                            <div>Form Number</div><br>
                            <span id="form-number" class="form-number">#####</span>
                        </h6>
                    </div>
                </div>

                <div class="row">
                    <form class="col s12 center">

                        <div class="row">
                            <div class="col s12 m2"></div>

                            <div class="input-field col s12 m8">
                                <select id="item-types" class="form-select-item" data-property="machine_item">
                                    <option value="" disabled selected>Choose a Machine</option>
                                    <option value="Compressor">Compressor</option>
                                    <option value="Condenser">Condenser</option>
                                </select>
                                <label for="machine">Machine</label>
                            </div>
                            <div class="col s12 m2"></div>
                        </div>

                        <div class="row">
                            <div class="col s12 m2"></div>

                            <div class="input-field col s12 m8">
                                <input placeholder="" id="quantity" type="number" class="form-input-item" min="0" max="15" value="0" data-property="quantity">
                                <label for="quantity">Quantity</label>
                            </div>
                            <div class="col s12 m2"></div>
                        </div>

                        <div class="row">
                            <div class="col s12 m2"></div>
                            <div class="input-field col s12 m8">
                                <textarea id="notes" class="materialize-textarea form-input-item" data-property="notes"></textarea>
                                <label for="notes">Notes</label>
                            </div>
                            <div class="col s12 m2"></div>
                        </div>

                        <div class="row">
                            <div class="col s12 offset-m2 m8">
                                <a class="waves-effect waves-light btn right" id="submit-form">Submit Order</a>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        `;

        add_html({
            element: RENDER_SOURCE,
            value: _html
        });

    }

    //methods
    generateXML(val) {
        let _machine = val;
        let xmlString = '<root att="val"><foo><bar>foobar</bar></foo></root>';
        return xmlString;
    }

    //triggers

    //controllers
    async submitForm(value) { //insert form

        append_html({
            element: RENDER_SOURCE,
            value: renderPreLoader(true, true)
        });

        let userLogged = localDB.get(['log_token']);
        console.log(userLogged)
        this.machine.customer = {
            "id": 1,
            "name": "Joseph Legere"
        }
        
        const res = await axios.post(SERVER_ATTR.PAGE_MACHINE, this.machine, { // <= proxy didn't work
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then(function (res) {
                // handle success
                console.log(res);
                let _res = res.data;
                
                if (!_res.success) throw { incomplete: _res };

                M.toast({
                    html: 'You have successfully submitted the voucher!',
                    classes: 'green accent-4'
                });
            })
            .catch(function (err) {
                // handle error
                console.log(err);
                let _html = `${err}`;

                M.toast({
                    html: _html,
                    classes: 'red accent-4'
                });
            })
            .then(function () {
                remove_element({ value: '.loading-wrapper' })
                // always executed
            });
    }

}

export { RequestMachine };