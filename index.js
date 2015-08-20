var fs = require('fs');
var path = require('path');

function getLocales(cldrData) {
  readDir(cldrData).then(function(result) {
    return Promise.all(result.files.map(function(localeDir) {
      var fullPath = path.join(cldrData, localeDir);
      return readDir(fullPath);
    }));
  })
  .then(function(localeDirs) {
    for (var i = 0; i < localeDirs.length; i ++) {
      for (var j = 0; j < localeDirs[i].files.length; j ++) {
        console.log(path.join(cldrData, localeDirs[i].parentDir, localeDirs[i].files[j]));
      }
    }
  })
}

var DEPENDENCY_TYPES = {
  SHARED_JSON: 'Shared JSON (used by all locales)',
  LOCALE_JSON: 'Locale specific JSON (supplied for each locale)',
  MODULE: 'Another modules JSON'
}

var moduleDependencies = {
  'core': [
    { dependencyType: DEPENDENCY_TYPES.SHARED_JSON, dependency: 'cldr/supplemental/likelySubtags.json' }
  ],

  'currency': [
    { dependencyType: DEPENDENCY_TYPES.LOCALE_JSON, dependency: 'cldr/main/{locale}/currencies.json' },
    { dependencyType: DEPENDENCY_TYPES.SHARED_JSON, dependency: 'cldr/supplemental/currencyData.json' },
    { dependencyType: DEPENDENCY_TYPES.MODULE,      dependency: 'number' },
    { dependencyType: DEPENDENCY_TYPES.MODULE,      dependency: 'plural' }
  ],

  'date': [
    { dependencyType: DEPENDENCY_TYPES.LOCALE_JSON, dependency: 'cldr/main/{locale}/ca-gregorian.json' },
    { dependencyType: DEPENDENCY_TYPES.LOCALE_JSON, dependency: 'cldr/main/{locale}/timeZoneNames.json' },
    { dependencyType: DEPENDENCY_TYPES.SHARED_JSON, dependency: 'cldr/supplemental/timeData.json' },
    { dependencyType: DEPENDENCY_TYPES.SHARED_JSON, dependency: 'cldr/supplemental/weekData.json' },
    { dependencyType: DEPENDENCY_TYPES.MODULE,      dependency: 'number' }
  ],

  'number': [
    { dependencyType: DEPENDENCY_TYPES.LOCALE_JSON, dependency: 'cldr/main/{locale}/numbers.json' },
    { dependencyType: DEPENDENCY_TYPES.SHARED_JSON, dependency: 'cldr/supplemental/numberingSystems.json' },
    { dependencyType: DEPENDENCY_TYPES.MODULE,      dependency: 'core' }
  ],

  'plural': [
    { dependencyType: DEPENDENCY_TYPES.SHARED_JSON, dependency: 'cldr/supplemental/plurals.json' },
    { dependencyType: DEPENDENCY_TYPES.SHARED_JSON, dependency: 'cldr/supplemental/ordinals.json' },
    { dependencyType: DEPENDENCY_TYPES.MODULE,      dependency: 'core' }
  ],

  'relativeTime': [
    { dependencyType: DEPENDENCY_TYPES.LOCALE_JSON, dependency: 'cldr/main/{locale}/dateFields.json' },
    { dependencyType: DEPENDENCY_TYPES.MODULE,      dependency: 'number' },
    { dependencyType: DEPENDENCY_TYPES.MODULE,      dependency: 'plural' }
  ]
};

function determineRequiredCldrData(globalizeOptions) {
  var modules = Object.keys(globalizeOptions);
  modules.forEach(function(module) {
    if (!moduleDependencies[module]) {
      throw new TypeError('There is no \'' + module + '\' module');
    }
  });

  var jsonDeps = [];
  modules.forEach(function (module) {
    populateDependencies(module, jsonDeps);
  });

  return jsonDeps;
}

function populateDependencies(module, jsonDeps) {
  var dependencies = moduleDependencies[module];
  dependencies.forEach(function(dependency) {
    if (dependency.dependencyType === DEPENDENCY_TYPES.MODULE) {
      populateDependencies(dependency.dependency, jsonDeps);
    }
    else if (jsonDeps.indexOf(dependency.dependency) === -1) {
      jsonDeps.push(dependency.dependency);
    }
  })
  return jsonDeps;
}

function determineRequiredGlobalizeModules(globalizeOptions){
  var coreFiles = ['cldr.js', 'cldr/event.js', 'cldr/supplemental.js', 'globalize.js'];
  if (globalizeOptions.currency)     { coreFiles.push('globalize/currency.js'); }
  if (globalizeOptions.date)         { coreFiles.push('globalize/date.js'); }
  if (globalizeOptions.message)      { coreFiles.push('globalize/message.js'); }
  if (globalizeOptions.number)       { coreFiles.push('globalize/number.js'); }
  if (globalizeOptions.plural)       { coreFiles.push('globalize/plural.js'); }
  if (globalizeOptions.relativeTime) { coreFiles.push('globalize/relative-time.js'); }

//  var globalizeFiles = coreFiles.map(function(file) { return path.join(globalize, file); });
  console.log('You are going to need these files:');
  coreFiles.forEach(function(x) { console.log(x); });
}

function readDir(dir){
  return new Promise(function (fulfill, reject) {
    fs.readdir(dir, function (err, files) {
      if (err) { reject(err); } else { fulfill({ parentDir: dir, files: files }); };
    });
  });
}

module.exports = { getLocales: getLocales, determineRequiredCldrData: determineRequiredCldrData, determineRequiredGlobalizeModules: determineRequiredGlobalizeModules };

// locales.forEach(function(locale){
//   fs.readdirSync(path.join(localeDir, locale)).forEach(function(localeFile) {
//     console.log(path.join(localeDir, locale, localeFile));
//   });
// });
/*
Promise.all([
  // Core
  fetch('bower_components/cldr-data/supplemental/likelySubtags.json'),

  // Date
  fetch('bower_components/cldr-data/main/' + locale + '/ca-gregorian.json'),
  fetch('bower_components/cldr-data/main/' + locale + '/timeZoneNames.json'),
  fetch('bower_components/cldr-data/supplemental/timeData.json'),
  fetch('bower_components/cldr-data/supplemental/weekData.json'),

  // Number
  fetch('bower_components/cldr-data/main/' + locale + '/numbers.json'),
  fetch('bower_components/cldr-data/supplemental/numberingSystems.json'),
])
.then(function(responses) {
    return Promise.all(responses.map(function(response) {
        return response.json();
    }));
})
*/

    // var stat = fs.statSync(file);
    //
    // if (stat && stat.isDirectory()) {
    //     results = results.concat(_getAllFilesFromFolder(file))
    // } else results.push(file);


/*
currency: true,
date: true,
number: true,
plural: true,
relativeTime: true,

globalize.js	1.3KB	Core library
globalize/currency.js	+2.6KB	Currency module provides currency formatting and parsing
globalize/date.js	+4.9KB	Date module provides date formatting and parsing
globalize/message.js	+5.4KB	Message module provides ICU message format support
globalize/number.js	+2.9KB	Number module provides number formatting and parsing
globalize/plural.js	+1.7KB	Plural module provides pluralization support
globalize/relative-time.js*/
