//import * as pdfjs from  '../modules/pdfjs-dist/build/pdf.js';
import { append_html, add_html, remove_element } from '../library/library.js';

let PrintDoc = class {

    constructor(root) { //root => root element for the page

        //external elements

        //internal elements
        this.root = root; //page container
        this.trigger_elements = {};
        
        this.pdf_source = './scripts/essentials/printDoc/temp/pdf.pdf';
        //this.pdf_source = './gemsaccounting/scripts/essentials/printDoc/temp/pdf2.pdf';
        //this.pdf_source = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageIsRendering = false;
        this.pageNumIsPending = null;
        this.table_data = {};

        this.scale = 1.5;

        this.set_default();

        this.set_modal(); //viewer and print
        this.triggers();

        this.canvas = document.querySelector('#pdf-render');
        this.ctx = this.canvas.getContext('2d');
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = './modules/pdfjs-dist/build/pdf.worker.js';

    }

    triggers() {
        let root_element = document.querySelector(this.root);

        let printViewer = document.querySelector('#print-viewer');
        let printViewer_instance = M.Modal.init(printViewer, {
            startingTop: '2%',
            endingTop: '3%'
        });
        
        let printFile = document.querySelector('#print-file');
        let printFile_instance = M.Modal.init(printFile, {
            startingTop: '2%',
            endingTop: '3%'
        });

        let trigger_1_function = async (e) => {
            let prevPage = e.target.closest('#prev-page');
            let nextPage = e.target.closest('#next-page');

            if (prevPage) {
                this.showPrevPage();
            }

            if (nextPage) {
                this.showNextPage();
            }
        }
        
        let trigger_1 = root_element.addEventListener('click', trigger_1_function);

        //mutations


        this.trigger_elements = {
            'printViewer_modal': printViewer_instance,
            'printFile_modal': printFile_instance,
            'trigger_1': {
                event: 'click',
                action: trigger_1_function
            }
        }

    }

    set_default() {
    }

    set_modal() {

        let _root = this.root;
        let _html = '';

        _html = `
            <div id="print-viewer" class="modal modal-fixed-footer">
                <div class="modal-content">
                    <canvas id="pdf-render"></canvas>
                </div>
                <div class="modal-footer">
                    <a class="waves-effect waves-light btn" id="prev-page"><i class="material-icons left">keyboard_arrow_left</i>Previous</a>
                    <a class="waves-effect waves-light btn" id="next-page"><i class="material-icons right">keyboard_arrow_right</i>Next</a>

                    <span class="page-info">
                        Page <span id="page-num"></span> of <span id="page-count"></span>
                    </span>

                    <a href="javascript:void(0)" class="modal-close waves-effect waves-red btn-flat">Close</a>
                </div>
            </div>

            <div id="print-file" class="modal modal-fixed-footer">
                <div class="modal-content">
                    <!--iframe id="print-pdf-render" name="print-pdf-render" style="width:100%;height:100%;border:none;"></iframe-->
                </div>
                <div class="modal-footer">
                    <a href="javascript:void(0)" class="modal-close waves-effect waves-red btn-flat">Close</a>
                </div>
            </div>
        `;

        append_html({
            element: _root,
            value: _html
        });

    }

    generatePDF(data) {
        let doc = new jsPDF();

        // You can use html:
        //doc.autoTable({ html: '#vouchers-table' });

        doc.setFontSize(12);
        doc.text(`Date 24-July-2019`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        doc.autoTable({
            head: data.head,
            body: data.body,
            startY: 50,
            showHead: 'firstPage'
        });
        console.log('yes, pdf generated');
        //doc.output('save', './temp/pdf.pdf');
        let _pdf = doc.output('datauristring');
        this.pdf_source = _pdf;
        console.log(_pdf)
    }

    modal(data, print) { //option to preview or print

        console.log(data)
        this.pdf_source = data;

        //this.generatePDF(data);

        if (print) {
            if (print == 'print') {
                this.trigger_elements.printFile_modal.open(); //need to destroy the iframe after print
                let _html = '';

                _html = `
                    <iframe id="print-pdf-render" name="print-pdf-render"
                        src="${this.pdf_source}"></iframe>
                `;

                add_html({
                    element: '#print-file .modal-content',
                    value: _html
                });

            }
        }
        else {
            this.trigger_elements.printViewer_modal.open();
            this.getDocument();
        }
    }

    new_page() { //print option (more likely pdf version)

    }
    
    renderPage(num) {
        this.pageIsRendering = true;
        
        // Get page
        this.pdfDoc.getPage(num).then(page => {

            // Set scale
            const viewport = page.getViewport(this.scale);
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            const renderCtx = {
                canvasContext: this.ctx,
                viewport
            };

            page.render(renderCtx).promise.then(() => {
                this.pageIsRendering = false;

                if (this.pageNumIsPending !== null) {
                    renderPage(this.pageNumIsPending);
                    this.pageNumIsPending = null;
                }
            });

            // Output current page
            document.querySelector('#page-num').textContent = num;
        });
    }

    // Check for pages rendering
    queueRenderPage(num) {
        if (this.pageIsRendering) {
            this.pageNumIsPending = num;
        } else {
            this.renderPage(num);
        }
    }

    // Show Prev Page
    showPrevPage() {
        if (this.pageNum <= 1) {
            return;
        }
        this.pageNum--;
        this.queueRenderPage(this.pageNum);
    };

    // Show Next Page
    showNextPage() {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }
        this.pageNum++;
        this.queueRenderPage(this.pageNum);
    };

    // Get Document
    getDocument() {
        this.pdfjsLib
        .getDocument(this.pdf_source)
        .promise.then(pdfDoc_ => {
            this.pdfDoc = pdfDoc_;
            document.querySelector('#page-count').textContent = this.pdfDoc.numPages;
            this.renderPage(this.pageNum);
        })
        .catch(err => {
            console.log(err)
            // Display error
            /*const div = document.createElement('div');
            div.className = 'error';
            div.appendChild(document.createTextNode(err.message));
            document.querySelector('body').insertBefore(div, this.canvas);
            // Remove top bar
            document.querySelector('.top-bar').style.display = 'none';*/
        });
    }
}

export { PrintDoc };