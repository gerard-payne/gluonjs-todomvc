/*global module, require */
module.exports = function (grunt) {
    'use strict';
    require('time-grunt')(grunt);
    // settings
    var _rootDirectory = ".",
        _sourceDirectory = "source",
        _buildDirectory = "build",
        _releaseDirectory = "release",
        _filePattern = ['**/*.*'],
        _defaultHost = '127.0.0.1',
        _defaultPort = 80,
        _testPort = 8080;

    // task configs
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // ------------------------------------------------------
        watch: {
            project: {
                files: [_sourceDirectory + '/**/*.*'],
                tasks: ['build']
            }
        },
        // ------------------------------------------------------
        copy: {
            npm: {
                cwd: 'node_modules',
                src: [
                    'gluonjs/**/*.*',
                    'gluon-router/**/*.*',
                    'lit-html/**/*.*',
                    'todomvc-common/**/*.*',
                    'todomvc-app-css/**/*.*'
                ],
                dest: _buildDirectory + '/node_modules',
                expand: true
            },                  
            build: {
                cwd: _sourceDirectory,
                src: [_filePattern],
                dest: _buildDirectory,
                expand: true
            },
            release: {
                cwd: _buildDirectory,
                src: ['/**/*.*'],
                dest: _releaseDirectory,
                expand: true
            }
        },
        // ------------------------------------------------------    
        uglify: {
            options: {
                mangle: false,
                banner: 'var gluon_js = GluonJS;'
            },
            bundle: {
                files: {
                    'build/TodoList.min.js': [
                        'node_modules/gluonjs/gluon.js'
                    ]
                }
            }
        },
        // ------------------------------------------------------
        connect: {
            test: {
                options: {
                    base: _buildDirectory,
                    hostname: `${_defaultHost}`,
                    port: _testPort,
                    useAvailablePort: false
                }
            },
            develop: {
                options: {
                    base: _buildDirectory,
                    hostname: `${_defaultHost}`,
                    port: _defaultPort,
                    useAvailablePort: true,
                    open: {
                        target: `http://${_defaultHost}:${_defaultPort}`,
                        livereload: 4500
                    }
                }
            }
        },
        // ------------------------------------------------------
        clean: [_buildDirectory, _releaseDirectory]
    });

    // task modules
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('install', ['clean']);
    grunt.registerTask('build',   ['copy:npm', 'copy:build']);
    grunt.registerTask('develop', ['install', 'build', 'connect:develop', 'watch']);
    grunt.registerTask('release', ['install', 'test', 'copy:release']);
    // development task
    grunt.registerTask('default', ['develop']);
};
