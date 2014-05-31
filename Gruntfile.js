module.exports = function (grunt) {

    // load local tasks

    //grunt.loadNpmTasks('grunt-html2js');
    grunt.loadTasks('lib/project/grunt-html2js-var/tasks');
    //grunt.loadNpmTasks('grunt-import');
    grunt.loadTasks('lib/project/grunt-import-js/tasks');

    // load 3rd party tasks

    // prepare encapsulated source files
    grunt.loadNpmTasks('grunt-contrib-less');

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

    // configure the tasks
    grunt.initConfig({

        // external library versions
        ngversion: '1.2.16',
        components: [], //to be filled in by build task
        libs: [], //to be filled in by build task
        dist: 'dist',
        filename: 'ui-components',
        filenamecustom: '<%= filename %>-custom',

        // make the NPM configs available as vars
        pkg: grunt.file.readJSON('package.json'),
        srcDir: 'src/',
        buildSrcDir: 'build/src/',

        // keep a module:filename lookup table since there isn's
        // a regular naming convention to work with
        // all small non-component and 3rd party libs
        // MUST be included here for build tasks
        libMap: {
            "ui.bootstrap.custom":"ui-bootstrap-collapse.js",
            "ngSanitize":"angular-sanitize.min.js"
        },

        meta: {
            modules: 'angular.module("uiComponents", [<%= srcModules %>]);',
            all: '<%= meta.srcModules %>',
            banner: ['/*',
                ' * <%= pkg.name %>',
                ' * <%= pkg.repository.url %>\n',
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
            },
            chrome: {
                autoWatch: true,
                browsers: ['Chrome']
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
            // compile seperate css for each component
            dev: {
                files: [
                    {
                        expand: true, // Enable dynamic expansion.
                        cwd: 'src/', // Src matches are relative to this path.
                        src: ['**/*.less', '!**/less/*.less'], // Actual pattern(s) to match.
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
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist:{
                src:['<%= concat.comps.dest %>'],
                dest:'<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
            }
        },
        concat: {
            // it is assumed that libs are already minified
            libs: {
                src: [],
                dest: '<%= dist %>/libs.js'
            },
            // concatenate just the modules, the output will
            // have libs prepended after running distFull
            comps: {
                options: {
                    banner: '<%= meta.banner %><%= meta.modules %>\n'
                },
                //src filled in by build task
                src: [],
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
            },
            // create minified file with everything
            distMin: {
                options: {},
                //src filled in by build task
                src: ['<%= concat.libs.dest %>','<%= uglify.dist.dest %>'],
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
            },
            // create unminified file with everything
            distFull: {
                options: {},
                //src filled in by build task
                src: ['<%= concat.libs.dest %>','<%= concat.comps.dest %>'],
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
            }
        }
    });

    grunt.registerTask('preCommit', ['jshint:all', 'karma:unit']);
    grunt.registerTask('dev', ['html2jsVar:main', 'importJs:dev', 'less:dev']);
    grunt.registerTask('default', ['dev', 'preCommit']);

    // Credit portions of the following code to UI-Bootstrap team
    // functions supporting build-all and build custom tasks
    var foundComponents = {};
    //var _ = grunt.util._;
    var _ = require('lodash');

        // capitalize utility
    function ucwords (text) {
        return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    }

    // uncapitalize utility
    function lcwords (text) {
        return text.replace(/^([A-Z])|\s+([A-Z])/g, function ($1) {
            return $1.toLowerCase();
        });
    }

    // enclose string in quotes
    // for creating "angular.module(..." statements
    function enquote(str) {
        return '"' + str + '"';
    }

    function findModule(name) {

        // by convention, the "name" of the module for files, dirs and
        // other reference is Capitalized
        // the nme when used in AngularJS code is not
        name = ucwords(name);

        // we only need to process each component once
        if (foundComponents[name]) { return; }
        foundComponents[name] = true;

        // add space to display name
        function breakup(text, separator) {
            return text.replace(/[A-Z]/g, function (match) {
                return separator + match;
            });
        }

        // gather all the necessary component meta info
        // todo - include doc and unit test info
        var component = {
            name: name,
            moduleName: enquote('uiComponents.' + lcwords(name)),
            displayName: breakup(name, ' '),
            srcDir: 'src/' + name + '/',
            buildSrcDir: 'build/src/' + name + '/',
            buildSrcFile: 'build/src/' + name + '/' + name + '.js',
            dependencies: dependenciesForModule(name),
            docs: {} // get and do stuff w/ assoc docs
        };

        // recursively locate all component dependencies
        component.dependencies.forEach(findModule);

        // add this component to the official grunt config
        grunt.config('components', grunt.config('components')
            .concat(component));
    }

    // for tracking misc non-component and 3rd party dependencies
    // does not include main libs i.e. Angular Core, jQuery, etc
    var dependencyLibs = [];

    function dependenciesForModule(name) {
        var srcDir = grunt.config('buildSrcDir');
        var path = srcDir + name + '/';
        var deps = [];

        // read in component src file contents
        var source = grunt.file.read(path + name + '.js');

        // parse deps from "angular.module(x,[deps])" in src
        var getDeps = function(contents) {

            // Strategy: find where module is declared,
            // and from there get everything i
            // nside the [] and split them by comma
            var moduleDeclIndex = contents
                .indexOf('angular.module(');
            var depArrayStart = contents
                .indexOf('[', moduleDeclIndex);
            var depArrayEnd = contents
                .indexOf(']', depArrayStart);
            var dependencies = contents
                .substring(depArrayStart + 1, depArrayEnd);
            dependencies.split(',').forEach(function(dep) {

                // locate our components that happen to be deps
                // for tracking by grunt.config
                if (dep.indexOf('uiComponents.') > -1) {
                    var depName = dep.trim()
                        .replace('uiComponents.','')
                        .replace(/['"]/g,'');
                    if (deps.indexOf(depName) < 0) {
                        deps.push(ucwords(depName));
                        // recurse through deps of deps
                        deps = deps
                            .concat(dependenciesForModule(depName));
                    }
                // attach other deps to a non-grunt var
                } else {
                    var libName = dep.trim().replace(/['"]/g,'');
                    if(libName && !_.contains(dependencyLibs ,libName) ){
                        dependencyLibs.push(libName);
                    }
                }
            });
        };
        getDeps(source);
        return deps;
    }

    grunt.registerTask('build', 'Create component build files', function() {

        // map of all non-component deps
        var libMap = grunt.config('libMap');
        // array of the above to include in build
        var libFiles = grunt.config('libs');
        var fileName = '';
        var buildSrcFiles = [];

        var addLibs = function(lib){
            fileName = 'lib/' + libMap[lib];
            libFiles.push(fileName);
        };

        //If arguments define what modules to build,
        // build those. Else, everything
        if (this.args.length) {
            this.args.forEach(findModule);
            _.forEach(dependencyLibs, addLibs);
            grunt.config('filename', grunt.config('filenamecustom'));

        // else build everything
        } else {
            // include all non-component deps in build
            var libFileNames = _.keys(grunt.config('libMap'));
            _.forEach(libFileNames, addLibs);
        }
        grunt.config('libs', libFiles);

        var components = grunt.config('components');
        // prepare source modules for custom build
        if(components.length){
            grunt.config('srcModules', _.pluck(components, 'moduleName'));
            buildSrcFiles = _.pluck(components, 'buildSrcFile');
        // all source files for full library
        }else{
            buildSrcFiles = grunt.file.expand([
                'build/src/**/*.js',
                '!build/src/**/*.tpl.js',
                '!build/src/**/test/*.js'
            ]);

            // prepare module names for "angular.module('',[])" in build file
            var mods = [];
            _.forEach(buildSrcFiles, function(src){
                var filename = src.replace(/^.*[\\\/]/, '')
                    .replace(/\.js/,'');
                filename = enquote('uiComponents.' + lcwords(filename));
                mods.push(filename);
            })
            grunt.config('srcModules', mods);
        }

        // add src files to concat sub-tasks
        grunt.config('concat.comps.src', grunt.config('concat.comps.src')
            .concat(buildSrcFiles));
        grunt.config('concat.libs.src', grunt.config('concat.libs.src')
            .concat(libFiles));

        // time to put it all together
        grunt.task.run([
            'karma:unit',
            'concat:libs',
            'concat:comps',
            'uglify',
            'concat:distMin',
            'concat:distFull'
        ]);
    });

    grunt.registerTask('default', ['dev', 'preCommit', 'build']);
};