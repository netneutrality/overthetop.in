'use strict';

/* Filters */

var ottappFilters = angular.module('ottapp.filters', []);

/* Converts ASCII newlines (\n) to HTML breaks (<br/>) */
ottappFilters.filter('nlbr', function() {
    return function(text) {
	if (text != undefined)
	    return text.replace(/\n/g, '<br/>');
    };
});

/* Converts ASCII tab space (\t) to HTML non-breaking spaces (&nbsp;) */
ottappFilters.filter('tbsp', function() {
    return function(text) {
	if (text != undefined)
	    return text.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    };
});

/* Escapes HTML start tag (<) to (&lt;). */
ottappFilters.filter('esclt', function() {
    return function(text) {
	if (text != undefined)
	    return text.replace(/</g, '&lt;');
    };
});

/* Converts fullstop (.) to underscores (_). */
ottappFilters.filter('fs2us', function() {
    return function(text) {
	if (text != undefined)
	    return text.replace('.', '_');
    };
});

/* Converts bytes to human readable bytes */
ottappFilters.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});
