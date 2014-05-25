module.exports = function (grunt) {

    // load 3rd party tasks

    // prepare encapsulated source files
    grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.loadNpmTasks('grunt-html2js');
    grunt.loadTasks('lib/project/grunt-html2js-var/tasks');
    //grunt.loadNpmTasks('grunt-import');
    grunt.loadTasks('lib/project/grunt-import-js/tasks');

    // check the js source code quality
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');

    // generate any ng style docs and verison info
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-conventional-changelog');

    // minify and combine js and css for production dist
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // set up any desired source file watches
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.loadNpmTasks('grunt-contrib-copy');

    // configure the tasks
    grunt.initConfig({

        // external library versions
        ngversion: '1.2.16',
        modules: [], //to be filled in by build task
        dist: 'dist',
        filename: 'ui-components',
        filenamecustom: '<%= filename %>-custom',

        // make the NPM configs available as vars
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            modules: 'angular.module("uiComponents", [<%= srcModules %>]);',
            //tplmodules: 'angular.module("ui.bootstrap.tpls", [<%= tplModules %>]);',
            //all: 'angular.module("ui.bootstrap", ["ui.bootstrap.tpls", <%= srcModules %>]);',
            all: '<%= meta.srcModules %>',
            banner: ['/*',
                ' * <%= pkg.name %>',
                ' * <%= pkg.homepage %>\n',
                ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                ' * License: <%= pkg.license %>',
                ' */\n'].join('\n')
        },

        karma: {
            options: {
                configFile: 'test/karma.conf.js',
                autoWatch: false,
                browsers: ['PhantomJS']
            },
            unit: {
                singleRun: true,
                reporters: 'dots'
            }
        },

        jshint: {
            options: {
                force: true
            },
            all: ['Gruntfile.js', 'src/**/*.js']
        },

        // provide options and subtasks for uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false,
                sourceMap: true
            },
            build: {
                src: 'js/MenuItem.js',
                dest: 'build/MenuItem.min.js'
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'build/src',
                    src: '*.js',
                    dest: 'build/test',
                    ext: '.min.js'
                }]
            }
        },

        html2jsVar: {
            options: {},
            dist: {
                options: {
                    module: null, // no bundle module for all the html2js templates
                    base: '.'
                },
                files: [{
                    expand: true,
                    src: ['template/**/*.html'],
                    ext: '.html.js'
                }]
            },
            main: {
                options: {
                    quoteChar: '\'',
                    module: null
                },
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'src/', // Src matches are relative to this path.
                    src: ['**/*.html'], // Actual pattern(s) to match.
                    dest: 'build/src/', // Destination path prefix.
                    ext: '.tpl.js' // Dest filepaths will have this extension.
                }]
            }
        },

        watch: {
            source: {
                files: ['src/**/*.js','src/**/*.html','!src/**/test/*.js'],
                tasks: ['dev'],
                options: {
                    livereload: true
                },
            },
        },

        importJs: {
            options: {},
            dev: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.js', '!**/test/*.js'],
                dest: 'build/src/',
                ext: '.js'
            }
        },

        less: {
            dev: {
                files: [
                    {
                        expand: true, // Enable dynamic expansion.
                        cwd: 'src/', // Src matches are relative to this path.
                        src: ['**/*.less'], // Actual pattern(s) to match.
                        dest: 'build/src/', // Destination path prefix.
                        ext: '.css' // Dest filepaths will have this extension.
                    }
                ],
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    'css/ui-components.css': 'src/less/ui-components.less'
                }
            }
        }
    });

    grunt.registerTask('preCommit', ['jshint:all', 'karma:unit']);
    grunt.registerTask('dev', ['html2jsVar:main', 'importJs:dev', 'less:dev']);
    grunt.registerTask('test', ['html2jsVar:main', 'importJs:dev', 'uglify:test']);
};