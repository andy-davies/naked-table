# naked-table
An implementation of a data driven HTML table that focuses on raw functionality and lets you decided on things like styling
git pull

## Installation

The library is designed for use in a browser, and so you can simply drop in a standard script tag:

`
    <script src="naked-table.js"></script>
`

## Basic Usage

Setting up a naked table is super simple, and requires a just three simple steps. The first step in using the table is to simple define a placeholder Html element on your page with any unique id that you want, e.g:

`
    <div id="tableTest"></div>
`

The next step is simply create a new naked-table object. The constructor takes in three arguments:

1. _*data*_: An array of JavasSript objects that you want to display
2. _*element id*_: The Id of the html element you want the table to render into
3. _*options*_: A JavaScript object that contains options that affect how the table operates

`
    let data = [{id: 1}, {id: 2}, {id: 3}];

    let options = { fields: ['id'], numbers: ['id'] }

    let nTable = new NakedTable(data, 'tableTest', options);
`

The final step is to apply an ordering to the table:

`
    nTable.order("id");
`