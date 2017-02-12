module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    copy: {
      build: {
        files: [
         {
           expand: true,
           cwd: 'src/',
           src: ["\*\*/\*", "!\*\*/\*.ts"],
           dest: "./dist/"
         }
        ]
      }
    },
    ts: {
      app: {
        files: [{
          src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./src"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false,
          allowJs: true
        }
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "ts",
    "watch"
  ]);

  grunt.registerTask("deploy", [
    "copy"
  ]);

};
