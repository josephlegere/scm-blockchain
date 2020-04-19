let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let months_abbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let date_formats = {
    'dd': getToday().getDate(),
    'MM': months[getToday().getMonth()],
    'mm': getToday().getMonth() + 1,
    'yyyy': getToday().getFullYear(),
    'w': getToday().getDay().toString() //get the "day name" of the week
}

//DOM Manipulate
let add_html = (params) => {
    let _elem = document.querySelector(params.element);
    _elem.innerHTML = params.value;
}

let append_html = (params) => {
    let _elem = document.querySelector(params.element);
    _elem.insertAdjacentHTML('beforeend', params.value);
}

let remove_element = (params) => {
    let _val = params.value;
    let _elem = document.querySelector(_val);
    if (_elem !== null) { //check if element exist, if not then no need to remove
        _elem.parentNode.removeChild(_elem);
    }
}

let renderPreLoader = (isAppend, bg) => {
    let _loader = '';

    if (bg) {
        _loader += `<div style="position:fixed;top:0;left:0;z-index:1000;width:100%;height:100%;" class="">
        </div>`;
    }

    _loader += `
        <div style="position:fixed;transform: translate(-50%, -50%); top: 50%; left: 50%;" class="loader-container">
            <div class="loader"></div>
        </div>
    `;

    if (!isAppend) {
        add_html({
            element: _render,
            value: _loader
        });
    }

    return _loader;
}

let dragElement = (elem) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    let trigger_function = async (e) => {
        let event = e;
        let dragHandle = event.target.closest('.drag-handle')
        let _row = dragHandle.parentNode.parentNode;
        
        if (dragHandle) {
            console.log(_row)
            //console.log(dragHandle.parentNode.parentNode)
            dragMouseDown(event)
        }

        function dragMouseDown (event) {
            console.log(e)
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            _row.style.position = 'absolute';
        }

        function elementDrag (e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            _row.style.top = (_row.offsetTop - pos2) + "px";
            _row.style.left = (_row.offsetLeft - pos1) + "px";
        }

        function closeDragElement () {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
            //_row.style.position = 'relative';
        }
    }

    let trigger = elem.addEventListener('mousedown', trigger_function);
    
    //if (dragHandle) {
        /* if present, the header is where you move the DIV from:*/
        //dragHandle.onmousedown = dragMouseDown;
    //} else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        //elmnt.onmousedown = dragMouseDown;
    //}
}


//methods
let isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

let isJSON = (str) => {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
} 

let capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let lowerCaseFirstLetter = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

let multiIndex = (arr, elem, type) => {
    let _return = -1;
    arr.forEach(function (value, key) {
        if (!isNaN(parseFloat(elem)) && isFinite(elem)) {
            if (value[type] == elem) {
                _return = key;
            }
        }
        else {
            if (value[type] == elem) {
                _return = key;
            }
        }
    });
    return _return;
}

let convert12To24 = (val) => {
    let _return = '';
    let time = val;

    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);
    let AMPM = time.match(/\s(.*)$/)[1];

    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;

    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;

    _return = sHours + ":" + sMinutes;

    return _return;
}

let convert24To12 = (val) => {
    let _return = '';
    let time = val;

    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);
    let AMPM = '';

    if (hours < 12 || hours == 24) AMPM = 'AM';
    else AMPM = 'PM';
    if (hours == 0 || hours == 24) hours = 12;
    if (AMPM == 'PM' && hours > 12) hours -= 12;

    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;

    _return = sHours + ":" + sMinutes + ' ' + AMPM;

    return _return;
}

let convertTimeToMin = (val) => {
    let _return = '';
    let hours = Number(val.match(/^(\d+)/)[1]) * 60;
    let minutes = Number(val.match(/:(\d+)/)[1]);
    _return = hours + minutes;

    return _return;
}

let convertMinToHR = (val) => {
    let _return = '';
    hours = (parseInt(val / 60)).toString().padStart(2, '0');
    minutes = (val % 60).toString().padStart(2, '0');
    _return = hours + ':' + minutes;
    return _return;
}

let convertMinToTime = (val) => {
    let _return = '';
    let _min = val;
    let hours = Math.floor(_min / 60);
    let minHr = hours * 60;
    let minutes = ((_min - minHr).toString()).padStart(2, '0');
    _return = hours + ':' + minutes;

    return _return;
}

let convertSecToMin = (val) => {
    let _return = '';
    let seconds = val;
    let minutes = parseInt(seconds) / 60;
    _return = minutes;
    return _return;
}

let numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let convertNewLine = (x) => {
    return x.replace(/\r?\n/g, '<br>');
}

let convertLineBreak = (x) => {
}

//time
let dateTime = {

    var_formats (str, today) {

        let _formats = {
            'dd': today.getDate(),
            'MM': months[today.getMonth()],
            'mm': today.getMonth() + 1,
            'yyyy': today.getFullYear(),
            'w': today.getDay().toString() //get day name of the week
        }
        
        let _string = '';
        let format_string = '';
        let additional_string = null;

        try {
            Object.entries(_formats).forEach((e) => {
                let _key = e[0];
                let _val = e[1];
                format_string = new RegExp(_key, 'g');
                format_string = str.match(format_string);
                if (format_string !== null) {
                    additional_string = str.replace(format_string, ' ');
                    throw null
                }
            });
        }
        catch (e) {
            //none
        }
        
        additional_string = additional_string.split(' ');
        _string = additional_string[0] + _formats[format_string] + additional_string[1];

        return _string;
    },

    getDateTime (dateStr) {
        let _dateString = dateStr
        let _date = null;

        _date = this.getFormat(_dateString);
        return _date;
    },

    getFormat (str) {

        let date_format_list = []; //element, start, length
        let _dateTime = '';

        let _string = str;
        let _string_list = _string.split('');

        Object.entries(date_formats).forEach((elem) => { //initial review of the string parameters, to determine the position of every date_format in the string
            let _format_elem = elem[0];
            let position = _string.indexOf(_format_elem);
            let _length = _format_elem.length;
            
            while (position !== -1) {
                if (position > -1) {
                    date_format_list.push([_format_elem, position, _length]);
                }
                position = _string.indexOf('i', position + 1);
            }
        });

        date_format_list.sort((a, b) => { //sort the date format list
            return a[1] - b[1];
        });
        
        let _range = _string_list.length; //range of string_list(array)
        let _count = 0; //index of "date format list"
        
        for ( let i = 0; i < _range; i++ ) {
            let _elem = _string_list[i];
            
            if (date_format_list[_count][1] == i) { //"date format" element that would be retrieve from the "date_formats" collection
                _dateTime += date_formats[date_format_list[_count][0]];
                i += (date_format_list[_count][2] - 1);
                _count++;
            }
            else { //regular element from the "string array"
                _dateTime += _elem;
            }
        }
        
        return _dateTime;
    }

}

//Global Functions
//time
function getToday () { //get today instance
    let today = new Date();
    return today;
}

export {
    add_html,
    append_html,
    remove_element,
    renderPreLoader,
    numberWithCommas,
    convertNewLine,
    isJSON,
    dateTime,
    dragElement
};