# Naked-Table
Naked-Table is a JavaScript library that provides the basic functionality for dynamically creating tables on a web if you supply it with an array of data. It's called Naked-Table because it is not concerned with any styling and or page interaction other than what it provides. All of this is left to be added by you so that it fits into your page and how you want it to work. 

## Features

1. Automatic creation of HTML table from data
1. Lazy loading makes it suitable for large amounts of data as it only rendered data that is visible to the user
1. Column ordering is automatically added
1. Allows searching of data
1. Custom column ordering icons to fit your site style

## Installation

The library is designed for use in a browser, and so you can simply drop in a standard script tag:

`
    <script src="naked-table.js"></script>
`

## Basic Usage

Setting up a naked table is super simple, and requires a just three steps. The first step in using the table is to define a placeholder Html element on your page with any unique id that you want, e.g:

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

## Options

The options object that you supply can have the following properties:

1. _**fields**_: An array of fieldnames that you want to use to for the columns in the table. The order of these define the order of the columns displayed in the table (_required_)
1. _**numbers**_: An array of fieldnames that are to be treated as numbers when the table is ordering data. If a field is not defined in here then it is assumed to be a string (_optional_)
1. _**showByDefault**_: A boolean that denotes if the table should show rows of data as soon as it is created. If you exclude this it defaults to `true` (_optional_)
1. _**trimObjects**_: A boolean that denotes if the objects in the data array have properties that are not defined in the _fields_ property trimmed from the object. Doing so decreases memoy usage and increases search performance. If you exclude this it defaults to `true` (_optional_)
1. _**indicatorAsc**_: A string containing the html to use for the ascending indicator. This can be any valid HTML. If not included a default indicator is used. It must also be used in conjunction with 'indicatorDec' (_optional_)
1. _**indicatorDec**_: A string containing the html to use for the descending indicator. This can be any valid HTML. If not included a default indicator is used. It must also be used in conjunction with 'indicatorAsc' (_optional_)


## Ordering

While the ability to click on the table header and sort by that column is included by default you can also invoke column ordering via JavaScript by calling the `order()` function on the table object. This method takes the following parameters:

1. _**fieldName**_: The field name by which to order by (_required_)
1. _**isAscending**_: A boolean denoting whether the order is ascending (`true`) or descending (`false`) (_optional_)

If you exclude the ordering and the table is already ordered by the field specified then the order is reversed, while if you exclude the ordering and define a new field to order by then an ascending ordering is assumed

## Searching 

Table data can be easily searched with only matching rows displayed. This is done by calling the _search()_ method, which takes a single parameter:

1. _**searchTerm**_: A string containing the search term to look for. If the string is empty then the serch is reset and all the rows are displayed (_required_)

There are no assumptions made about how the search should be presented to the user on the screen or how the user should interact with the search, therefore no UI elements are provided for searching and these must be provided by the page itself, for example:

```
    <input type="text" id="searchinput"><button onclick="performSearch()">Search</button>

    function performSearch() {
        nTable.search(document.getElementById('searchinput').value);
    }

```

This means that the page and not the table is in control of all of the styling and interaction with the search. 

## Applying Styles

As with the search there are no assumptions made about styling of the table, no inline styles are added to the table and no CSS classes are added either. However this does not mean that the table cannot be styled, you simply need to hang the styles off the 'id' that you used to define the table with. For example to make the table full width you can use:

```
    #tableTest {
        width: 100%;
    }

    #tableTest > table {
        width: 100%;
    }
```

Or to add striped rows you can use:

```
    #tableTest > table > tbody tr:nth-child(odd) {
        background: #ffffff;
    }

    #tableTest > table > tbody tr:nth-child(even) {
        background: #f4f4f4;
    }
```



