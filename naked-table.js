// Copyright (c) 2020 Andy Davies

class NakedTable {

    #numItems = 0;  
    #pageSize = 20;
    currentPage = 1;
    isAsc = null;
    currentOrderedColumn = "";  

    constructor (data, id, options) {
        this.data = data;
        this.elementId = id;
        this.options = options;
        this.currentSearch = "";

        this.init();
    }

    get numberofItems() {
        return this.#numItems;
    }

    init() {

        // if no asc / desc indicators have been specified then add in default ones
        if(this.options.indicatorAsc == undefined || this.options.indicatorDesc == undefined) {
            this.options.indicatorAsc = '&#8679;';
            this.options.indicatorDesc = '&#8681;';
        }

        if('trimObjects' in this.options === false) {
            this.options.trimObjects = true;
        }
        
        let trimData = null;
        if(this.options.trimObjects) {
            // work out which keys we'd want to trim
            trimData = Object.keys(this.data[0]).filter(key => !this.options.fields.some(field => field == key));
        }

        this.data.forEach(item => {
            // remove any unwanted keys from the object
            if(this.options.trimObjects) {
                trimData.forEach(i => delete item[i]);
            }

            // set each object to have the default selected value
            item._selected = this.options.showByDefault
            item._displayed = false;
        });

        let template = `<table border=1 CELLPADDING=6>
            <thead id="__head"><tr></tr></thead>
            <tbody id="__results"></tbody>
            </table><div id="scroll-observer"></div>`;

        document.getElementById(this.elementId).innerHTML = ""; 
        document.getElementById(this.elementId).insertAdjacentHTML('beforeend', template);

        this.options.fields.forEach(field => this.setupHeader(field));

        let observer = new IntersectionObserver(entries => this.observer(entries), {threshold:[0]});
        observer.observe(document.getElementById("scroll-observer"));
    }

    setupHeader (field) {
        
        let elm = document.createElement("TH");
        elm.innerHTML = `${field}`.replace(/([A-Z])/g, ' $1').trim(); // regex puts space before capital letters
        elm.addEventListener('mouseup', event => this.order(field));

        document.getElementById("__head").children[0].appendChild(elm);

    }

    observer (entries) {
        if(entries[0].isIntersecting === true) {
                this.currentPage++;
                this.drawTable();
        }
    }

    search(searchTerm) {

        // we don't allow searches of < 2 chars
        if(searchTerm.length < 2)
            return;

        this.currentPage = 0;
        this.#numItems = 0;
        this.currentSearch = searchTerm.toLowerCase();

        if(this.currentSearch != "")
            this.data.forEach(item => {
                item._selected = Object.values(item).some(e => e.toString().toLowerCase().includes(this.currentSearch))
                item._displayed = false;
            });
        else
            this.data.forEach(item => {
                item._selected = true
                item._displayed = false;
            });     

        document.getElementById("__results").innerHTML = "";

        this.drawTable();    
    }

    order(fieldName, bisAsc) {

        console.clear();

        // TODO: investigate TimSort for chromium based broswers
        // TODO: investigate whether array reverse is better when not changing sort column (or have logic to simply read array backwards, probably better)

        document.getElementById("__results").innerHTML = "";
        this.currentPage = 1;
        this.#numItems = 0;

        this.data.forEach(i => i._displayed = false);

        this.clearHeaderIcons();

        if(this.currentOrderedColumn === "")
            this.currentOrderedColumn = fieldName;

        if(bisAsc != undefined) {
            // use what was explicitly passed in for the directions 
            this.isAsc = bisAsc;
        }
        else {
            // work our the direction
            if(this.isAsc == null) {
                this.isAsc = true;
            }
            else if(this.currentOrderedColumn == fieldName) {
                this.isAsc = this.isAsc ? false : true;
            }
            else {
                this.isAsc = true;
                this.currentOrderedColumn = fieldName;
            }
        }
        
        if(this.isAsc)
        {
            if(this.options.numbers.some(e => e == fieldName)) 
                this.data.sort(this.getNumberSort(fieldName));
            else
                this.data.sort(this.getStringSort(fieldName));
        }
        else
        {
            if(this.options.numbers.some(e => e == fieldName)) 
                this.data.sort(this.getNumberSortDesc(fieldName));
            else
                this.data.sort(this.getStringSortDesc(fieldName));
        }

        console.table(this.data);

        this.drawTable(); 
        this.setHeaderIcons();
    }

    clearHeaderIcons() {
        let colIdx = this.options.fields.indexOf(this.currentOrderedColumn);
        if(colIdx > -1) {
            let elm = document.getElementById("__head").children[0].children[colIdx].innerHTML = this.currentOrderedColumn;
        }
    }

    setHeaderIcons () {
        let colIdx = this.options.fields.indexOf(this.currentOrderedColumn);
        let elm = document.getElementById("__head").children[0].children[colIdx];
        if(elm != undefined)
            elm.insertAdjacentHTML('beforeend', `<span style="float:right;">${this.isAsc ? this.options.indicatorAsc: this.options.indicatorDesc}</span>`);
    }

    drawTable () {


        console.trace("draw");
        let result = "";
        let c = 0; // controls how many items to add

        let startItem = (this.currentPage * this.#pageSize) - this.#pageSize;

        for (let itemIdx in this.data) {

            // skip items we already have
            if(itemIdx < startItem) {
                continue;
            }

            if(this.data[itemIdx]._selected && !this.data[itemIdx]._displayed)
            {
                let tmp = "<tr>";
                this.options.fields.forEach(field => {tmp += `<td>${this.data[itemIdx][field]}</td>`; });
                tmp += "</tr>";
                result += tmp;

                this.data[itemIdx]._displayed = true;

                this.#numItems++;

                //console.log("drawing record: " + this.data[itemIdx].id);

                c++;
            }

            if(c == this.#pageSize)
                break;
        }

        if(this.#numItems === 0 && this.currentSearch.length > 0){
            result += `<tr><td colspan=${this.options.fields.length}>No records found</td></tr>`;
        }
        document.getElementById("__results").insertAdjacentHTML('beforeend', result);
    }

    getStringSort(prop) {
        return function (a, b) {
        return a[prop].localeCompare(b[prop], undefined, {sensitivity : 'base'});
        }
    }

    getStringSortDesc(prop) {
        return function (a, b) {
        return -(a[prop].localeCompare(b[prop], undefined, {sensitivity : 'base'}));
        }
    }

    getNumberSort(prop) {
        return function (a, b) {
            if(a[prop] == b[prop])
                return 0;
            return a[prop] > b[prop] ? 1 : -1;
        }
    }

    getNumberSortDesc(prop) {
        return function (a, b) {
            if(a[prop] == b[prop])
                return 0;
            return  a[prop] < b[prop] ? 1 : -1;
        }
    }
}