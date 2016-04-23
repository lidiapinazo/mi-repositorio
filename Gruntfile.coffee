module.exports = (grunt) ->
  pkg = grunt.file.readJSON 'package.json'

  grunt.initConfig
    pkg: pkg

    jshint:
      all: ['js/**/*.js']

    concat:
      options:
        separator: ';'
      app:
        src: ['src/**/*.js']
        dest: 'build/js/<%= pkg.name %>.js'

    copy:
      vendor:
        files:
          'build/js/jquery.min.js': 'libs/jquery-dist/jquery.min.js'
          'build/js/underscore-min.js': 'libs/underscore/underscore-min.js'
          'build/js/backbone-min.js':   'libs/backbone/backbone-min.js'
          'build/js/require.js':        'libs/requirejs/require.js'
          'build/js/text.js': 'libs/text/text.js'
          'build/js/pageslider.js':     'libs/PageSlider/pageslider.js'
          'build/assets/css/pageslider.css':   'libs/PageSlider/css/pageslider.css'
      index:
        files:
          'build/index.html': 'src/index.html'
        options:
          process: (content, srcpath) ->
            content.replace '{{packageName}}', pkg.name
      assets:
        expand: true
        cwd: 'src'
        src: 'assets/**/*'
        dest: 'build/'

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      app:
        files:
          'build/js/<%= pkg.name %>.min.js': 'build/js/<%= pkg.name %>.js'

    watch:
      app:
        files: ['src/**/*.js']
        tasks: ['jshint', 'concat:app', 'uglify:app']
      tmpl:
        files: ['src/**/*.html']
        tasks: ['copy:assets', 'copy:index']

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['concat', 'copy', 'uglify', 'watch']
