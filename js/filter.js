/*
 * PS GO - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of pumpkin spice from the web page.
 */

// Variables
var regex = /Pumpkin Spice/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('Pumpkin Spice'), :contains('Pumpkin spice'), :contains('PUMPKIN SPICE'), :contains('pumpkin spice'), :contains('pumpkinspice'), :contains('pumpkin_spice'), :contains('Pumpkin-spice'), :contains('pumpkin-spice'), :contains('PSL'), :contains('psl')";


// Functions
function filterMild() {
    console.log("Filtering pumpkin spice with Mild filter...");
    return $(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault() {
    console.log("Filtering pumpkin spice with Default filter...");
    return $(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
    console.log("Filtering pumpkin spice with Vindictive filter...");
    return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
    if (filter == "mild") {
        return filterMild();
    } else if (filter == "vindictive") {
        return filterVindictive();
    } else {
        return filterDefault();
    }
}

function filterElements(elements) {
    console.log("Elements to filter: ", elements);
    elements.fadeOut("fast");
}


// Implementation
if (search) {
    console.log("Pumpkin Spice found on page! - Searching for elements...");
    chrome.storage.sync.get({
        filter: 'aggro',
    }, function (items) {
        console.log("Filter setting stored is: " + items.filter);
        elements = getElements(items.filter);
        filterElements(elements);
        chrome.runtime.sendMessage({method: "saveStats", pumpkinspices: elements.length}, function (response) {
            console.log("Logging " + elements.length + " pumpkin spices.");
        });
    });
    chrome.runtime.sendMessage({}, function (response) {
    });
}
