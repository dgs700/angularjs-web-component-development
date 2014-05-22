module.exports = function (grunt) {

    // load 3rd party tasks

    // prepare encapsulated source files
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-import');

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
        bsversion: '3.1.1',

        // make the NPM configs available as vars
        pkg: grunt.file.readJSON('package.json'),

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

        html2js: {
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
                    //indentString: '    ',
                    quoteChar: '\'',
                    module: null
                },
                files: {
                    'build/tmp/Dropdown.tpl.js': ['html/Dropdown.tpl.html'],
                    'build/tmp/MenuItem.tpl.js': ['html/MenuItem.tpl.html'],
                    'build/tmp/Navbar.tpl.js': ['html/Navbar.tpl.html'],
                    'build/tmp/SmartButton.tpl.js': ['html/SmartButton.tpl.html']
                }
                //src: ['html/*.tpl.html'],
                //dest: 'build/template/templates.js'
            }
        },
        watch: {
            files: [
                'js/*.js'
            ],
            tasks: ['uglify']
        },
        import: {
            options: {},
            dist: {
                expand: true,
                cwd: 'js/',
                src: '*.js',
                dest: 'build/src/',
                ext: '.js'
            }
        },
        less: {
            dev: {
                files: {
                    'css/ui-components.css': 'less/ui-components.less'
                }
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    'css/ui-components.css': 'less/ui-components.less'
                }
            }
        }
    });

//    grunt.registerTask('css', ['less:production']);
    grunt.registerTask('default', ['html2js']);
    grunt.registerTask('test', ['html2js:main', 'import:dist', 'uglify:test']);
};