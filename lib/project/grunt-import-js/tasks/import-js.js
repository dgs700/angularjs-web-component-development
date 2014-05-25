/*
 * grunt-import
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Marcin Rosinski, contributors
 * Licensed under the MIT license.
 */

'use strict';

String.prototype.__fullTrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};

module.exports = function(grunt) {

  grunt.registerMultiTask('importJs', '//@import - inline file import.', function() {

        var path = require('path');

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
          separator: grunt.util.linefeed,
          banner: '',
          footer: ''
        });

        // Process banner and footer.
        var banner  = grunt.template.process(options.banner);
        var footer  = grunt.template.process(options.footer);
        var target  = this.target;

        var array_unique = function(inputArr) 
        {
          var key = '',
            tmp_arr2 = {},
            val = '';

          var __array_search = function (needle, haystack) {
            var fkey = '';
            for (fkey in haystack) {
              if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                  return fkey;
                }
              }
            }
            return false;
          };

          for (key in inputArr) {
            if (inputArr.hasOwnProperty(key)) {
              val = inputArr[key];
              if (false === __array_search(val, tmp_arr2)) {
                tmp_arr2[key] = val;
              }
            }
          }

          return tmp_arr2;
        }

        var importRecursive = function(filepath)
        {
            var src = grunt.file.read(filepath);
            // now the replacement pattern in the target file
            // can be a valid js comment
            var importReg = src.match(/\/\/@import ['"](.*)['"]/g);
            //var importReg = src.match(/(?:(?![/*]])[^/* ]|^ *)@import ['"](.*?)['"](?![^*]*?\*\/)/gm);

            if(importReg && importReg.length)
            {
                var importReg_ = new Array();
                for(var i in importReg)
                {
                  importReg_[i] = importReg[i].__fullTrim();
                }

                importReg = importReg_;
                importReg = array_unique(importReg);

                for(var i in importReg)
                {
                    var importpath = importReg[i].replace('//@import ','').replace(/"/g,'').replace(/'/g,'');

                    if(importpath.indexOf('/')!==0)
                    {
                        importpath = path.resolve(path.dirname(filepath)+'/'+importpath);
                    }

                    if(grunt.file.exists(importpath))
                    {
                        var isrc = importRecursive(importpath);
                        src = src.split(importReg[i]+';').join(isrc);
                        src = src.split(importReg[i]).join(isrc);
                    }
                    else
                    {
                        grunt.log.warn('@import file "' + importpath + '" not found.');
                        src = src.split(importReg[i]+';').join('');
                        src = src.split(importReg[i]).join('');
                    }
                }
            }
            
            return src;
        };

        // Iterate over all src-dest file pairs.
        this.files.forEach(function(f) {

          // Prepend banner + @import + specified files + footer.
          var src = banner + f.src.filter(function(filepath) {

            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }

          }).map(function(filepath) {

            return importRecursive(filepath);

          }).join(options.separator) + footer;

          // Write the destination file.
          grunt.file.write(f.dest, src);
          grunt.event.emit('import', 'imported', f.dest, target);
          
          // Print a success message.
          grunt.log.writeln('File "' + f.dest + '" created.');
        });

        //Run tasks
        if(this.data.tasks){
          grunt.task.run(this.data.tasks);
        }
    });

};
