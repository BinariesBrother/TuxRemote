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
          src: ["src/\*\*/\*.ts", ["!src/.baseDir.ts", "!src/static"]],
          dest: "./dist"
        }],
        tsconfig: "./tsconfig.json"
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      },
      copy: {
        files: ["src/\*\*/\*", "!src/\*\*/\*.ts"],
        tasks: ["newer:copy"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask("default", [
    "ts",
    "watch"
  ]);

  grunt.registerTask("deploy", [
    "copy"
  ]);

};
