import { SERVER_ATTR, RENDER_SOURCE } from '../../configurations';
import { add_html, remove_element, renderPreLoader, numberWithCommas, convertNewLine } from '../../essentials/library/library';
import './requestMachine.scss'

let RequestMachine = class { //wrapper for the app itself, that would supposedly also jumpstart the app

    constructor() {

        this.page_container_title = 'request-machine';
        this.page_container = `#${this.page_container_title}`;

        //external elements

        //internal elements -> this includes properties that were converted from parameters
        this.trigger_elements = {};

        this.set_default();

        this.render();
        this.triggers();
    }

    triggers() {
        let root_element = document.querySelector(this.page_container);

        let trigger_click_function = async (e) => {
        }

        let trigger_click = root_element.addEventListener('click', trigger_click_function);

        let machine_select = document.querySelector('#item-types');
        let machine_instance_select = M.FormSelect.init(machine_select, {});

        this.trigger_elements = {
            'trigger click': {
                event: 'click',
                action: trigger_click
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
                        <b><span id="voucher-date">(date)</span></b>
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
                                <select id="item-types" class="form-select-item" data-property="machine">
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
                                <input placeholder="" id="quantity" type="number" class="" min="0" max="15" value="0">
                                <label for="quantity">Quantity</label>
                            </div>
                            <div class="col s12 m2"></div>
                        </div>

                        <div class="row">
                            <div class="col s12 m2"></div>
                            <div class="input-field col s12 m8">
                                <textarea id="notes" class="materialize-textarea"></textarea>
                                <label for="notes">Notes</label>
                            </div>
                            <div class="col s12 m2"></div>
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

    //triggers

    //controllers

}

export { RequestMachine };