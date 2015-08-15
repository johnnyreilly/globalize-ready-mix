var argv = require('yargs').argv;
var mixer = require('./index');

var globalizeOptions = {};

if (argv.currency)     { globalizeOptions.currency = true; }
if (argv.date)         { globalizeOptions.date = true; }
if (argv.message)      { globalizeOptions.message = true; }
if (argv.number)       { globalizeOptions.number = true; }
if (argv.plural)       { globalizeOptions.plural = true; }
if (argv.relativeTime) { globalizeOptions.relativeTime = true; }

// mixer.getLocales(options.locations.cldrData);
mixer.determineCldrDataRequired(globalizeOptions);
mixer.determineGlobalizeModulesRequired(globalizeOptions);

var plurals = require("cldr-data/supplemental/plurals");

// var fs = require('fs');
// fs.writeFile('plurals.json', JSON.stringify(plurals), function (err) {
//   if (err) throw err;
//   console.log('It\'s saved!');
// });


console.log(plurals);
var cldrData = require("cldr-data");
console.log(cldrData.availableLocales);
var x = require("cldr-data/main/" + cldrData.availableLocales[0] + "/ca-buddhist");
console.log(x);
