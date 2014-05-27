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
        libMap: {
            "ui.bootstrap.custom":"ui-bootstrap-collapse.js",
            "ngSanitize":"angular-sanitize.min.js"
        },

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
            libs: {
                src: [],
                dest: '<%= dist %>/libs.js'
            },
            comps: {
                options: {
                    banner: '<%= meta.banner %><%= meta.modules %>\n'
                },
                src: [], //src filled in by build task
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
            },
            dist: {
                options: {
                    //banner: '<%= meta.banner %><%= meta.modules %>\n'
                },
                src: ['<%= concat.libs.dest %>','<%= uglify.dist.dest %>'], //src filled in by build task
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
            }
            /*dist_tpls: {
                options: {
                    banner: '<%= meta.banner %><%= meta.all %>\n<%= meta.tplmodules %>\n'
                },
                src: [], //src filled in by build task
                dest: '<%= dist %>/<%= filename %>-tpls-<%= pkg.version %>.js'
            }*/
        }
    });

    grunt.registerTask('preCommit', ['jshint:all', 'karma:unit']);
    grunt.registerTask('dev', ['html2jsVar:main', 'importJs:dev', 'less:dev']);
    //grunt.registerTask('test', ['html2jsVar:main', 'importJs:dev', 'uglify:test']);
    grunt.registerTask('default', ['dev', 'preCommit']);


    //Common ui.bootstrap module containing all modules for src and templates
    //findModule: Adds a given module to config
    var foundComponents = {};
    var _ = grunt.util._;
    var ucwords = function(text) {
        return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    }
    var lcwords =  function(text) {
        return text.replace(/^([A-Z])|\s+([A-Z])/g, function ($1) {
            return $1.toLowerCase();
        });
    }
    function findModule(name) {

        // by convention, the "name" of the module for files, dirs and
        // other reference is Capitalized
        name = ucwords(name);

        if (foundComponents[name]) { return; }
        foundComponents[name] = true;
        function breakup(text, separator) {
            return text.replace(/[A-Z]/g, function (match) {
                return separator + match;
            });
        }
        function enquote(str) {
            return '"' + str + '"';
        }
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
        component.dependencies.forEach(findModule);
        grunt.config('components', grunt.config('components').concat(component));
    }

    var dependencyLibs = [];
    function dependenciesForModule(name) {
        var srcDir = grunt.config('buildSrcDir');
        var path = srcDir + name + '/';
        var deps = [];
        var source = grunt.file.read(path + name + '.js');

        var getDeps = function(contents) {
            //Strategy: find where module is declared,
            //and from there get everything inside the [] and split them by comma
            var moduleDeclIndex = contents.indexOf('angular.module(');
            var depArrayStart = contents.indexOf('[', moduleDeclIndex);
            var depArrayEnd = contents.indexOf(']', depArrayStart);
            var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
            dependencies.split(',').forEach(function(dep) {
                if (dep.indexOf('uiComponents.') > -1) {
                    var depName = dep.trim().replace('uiComponents.','').replace(/['"]/g,'');
                    if (deps.indexOf(depName) < 0) {
                        deps.push(ucwords(depName));
                        //Get dependencies for this new dependency
                        deps = deps.concat(dependenciesForModule(depName));
                    }
                } else {
                    // include non component dependencies in list
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
    grunt.registerTask('build', 'Create UI component build files', function() {
        var _ = grunt.util._;

        //If arguments define what modules to build, build those. Else, everything
        if (this.args.length) {
            this.args.forEach(findModule);
            var libMap = grunt.config('libMap');
            var libFiles = [];
            _.forEach(dependencyLibs, function(lib){
                var fileName = 'lib/' + libMap[lib];
                libFiles.push(fileName);
            })
            grunt.config('libs', libFiles);
            grunt.config('filename', grunt.config('filenamecustom'));
        } else {

            // concat and minify all source components
            // concat all libs from the libMap
            // concat libs and buildSrc
            /*grunt.file.expand({
                filter: 'isDirectory',
                cwd: '.'
            }, 'src*//*').forEach(function(dir) {
                findModule(dir.split('/')[1]);
            });*/

        }

        var components = grunt.config('components');
        grunt.config('srcModules', _.pluck(components, 'moduleName'));

        var buildSrcFiles = _.pluck(components, 'buildSrcFile');
        var libFiles = grunt.config('libs');
        //var tpljsFiles = _.pluck(modules, 'tpljsFiles');
        //Set the concat task to concatenate the given src modules
        grunt.config('concat.libs.src', grunt.config('concat.libs.src')
            .concat(libFiles));
        grunt.config('concat.comps.src', grunt.config('concat.comps.src')
            .concat(buildSrcFiles));

        console.warn(buildSrcFiles);
        console.warn(grunt.config('libs'));

//        grunt.task.run(['concat', 'uglify']);
        grunt.task.run(['concat:libs', 'concat:comps', 'uglify', 'concat:dist']);
    });

    grunt.registerTask('bt', 'build test', function(){
        if (this.args.length) {
            this.args.forEach(findModule);

            var libMap = grunt.config('libMap');
            var libFiles = [];
            _.forEach(dependencyLibs, function(lib){
                var fileName = 'lib/' + libMap[lib];
                libFiles.push(fileName);
            })

            grunt.config('libs', libFiles);
    console.warn(grunt.config('components'));
   console.warn(grunt.config('libs'));
            grunt.config('filename', grunt.config('filenamecustom'));

           // grunt.log.write(grunt.config('filename'));
        } else {
            // concat and minify all source components
            // concat all libs from the libMap
            // concat libs and
        }
    });

};