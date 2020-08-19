# Naked-Table
Naked-Table is a JavaScript library that provides the basic functionality for dynamically creating tables on a web if you supply it with an array of data. It's called Naked-Table because it is not concerned with any styling and or page interaction other than what it provides. All of this is left to be added by you so that it fits into your page and how you want it to work. 

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

1. _**data**_: An array of JavasSript objects that you want to display
1. _**element id**_: The Id of the html element you want the table to render into
1. _**options**_: A JavaScript object that contains options that affect how the table operates

```javascript
    let data = [{id: 1}, {id: 2}, {id: 3}];

    let options = { fields: ['id'], numbers: ['id'] }

    let nTable = new NakedTable(data, 'tableTest', options);
```

The final step is to apply an ordering to the table:

```javascript
    nTable.order("id");
```