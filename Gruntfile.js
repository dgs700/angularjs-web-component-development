module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-import');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-ngdocs');

    // Project configuration.
    //grunt.util.linefeed

    grunt.initConfig({
        ngversion: '1.2.16',
        bsversion: '3.1.1',

        pkg: grunt.file.readJSON('package.json'),
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
        }


    });

    grunt.registerTask('default', ['html2js']);
    grunt.registerTask('test', ['html2js:main', 'import:dist', 'uglify:test']);
};