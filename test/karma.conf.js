// Karma configuration
// Generated on Thu Apr 03 2014 16:39:13 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
        '../lib/jquery-2.1.0.min.js',
        '../lib/bootstrap.min.js',
        '../lib/angular.min.js',
        '../lib/angular-sanitize.min.js',
        '../lib/angular-mocks.js',
        '../lib/ui-bootstrap-collapse.js',
        '../js/UIComponents.js',
        '../build/src/SmartButton/SmartButton.js',
        '../build/src/SmartButton/test/SmartButtonSpec.js',
        '../build/src/MenuItem/MenuItem.js',
        '../build/src/Dropdown/Dropdown.js',
        '../build/src/Navbar/Navbar.js',
        '../build/src/MenuItem/test/MenuItemSpec.js',
        '../build/src/Dropdown/test/DropdownSpec.js',
        '../build/src/Navbar/test/NavbarSpec.js'
    ],
    // list of files to exclude
    exclude: [
      
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
