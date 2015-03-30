var resolve = require('bower-path');

module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                files: {
                    'libs/core.min.js': [
                        resolve('jquery'),
                        resolve('jquery-beacons')
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', [
        'uglify'
    ]);
};
