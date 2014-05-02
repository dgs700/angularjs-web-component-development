module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-ngdocs');

    // Project configuration.
    //grunt.util.linefeed = '\n';

    grunt.initConfig({
        ngversion: '1.2.16',
        bsversion: '3.1.1',

        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'js/MenuItem.js',
                dest: 'build/MenuItem.min.js'
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
                    'build/template/Dropdown.tpl.js': ['html/Dropdown.tpl.html'],
                    'build/template/MenuItem.tpl.js': ['html/MenuItem.tpl.html'],
                    'build/template/Navbar.tpl.js': ['html/Navbar.tpl.html'],
                    'build/template/SmartButton.tpl.js': ['html/SmartButton.tpl.html']
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


    });

    grunt.registerTask('default', ['html2js']);
};