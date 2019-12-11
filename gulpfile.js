const gulp = require("gulp");
const spawn = require('child_process').spawn;
const nodemon = require("gulp-nodemon");



const stylusCompiler = {
    watch: (desk) => {
        require("./compile-stylus").createCompiler(desk).watch();
    },
    compile: (desk) => {
        return require("./compile-stylus").createCompiler(desk).compile();
    }
};

const startServer = async (env) => {
    return nodemon({
        script: './server/server.js',
        ext: 'js',
        ignore: [
            ".idea/",
            ".git/",
            "gulpfile.js",
            "client/*",
            "public/*",
            "webpack.config.js",
            "webpack.prod.config.js",
            "build/*",
            "dist/*",
            "uploads/*"
        ],
        env,
        stdout: true,
        exec: "babel-node"
    })
};

gulp.task("dev", () => {
    return startServer({'NODE_ENV': 'development'}).then(() => {
        return stylusCompiler.watch("build");

    }).then(() => {
        if (!/^win/.test(process.platform)) { // linux
            return spawn("webpack", ["--watch"], {stdio: "inherit"});
        } else {
            return spawn('cmd', ['/s', "/c", "webpack", "--w"], {stdio: "inherit"});
        }
    }).then(() => {
        return spawn("node", ["./scripts/copy-assets", "dev"], {stdio: "inherit"})

    });

});


gulp.task("prod", () => {
    return startServer({'NODE_ENV': 'production'}).then(() => stylusCompiler.compile("dist").then(() => {
        if (!/^win/.test(process.platform)) { // linux
            return spawn("webpack", ["--config ./webpack.prod.config.js"], {stdio: "inherit"});
        } else {
            return spawn('cmd', ['/s', "/c", "webpack", "--config ./webpack.prod.config.js"], {stdio: "inherit"});
        }
    })).then(() => {
        return spawn("node", ["./scripts/copy-assets", "prod"], {stdio: "inherit"})
    });
});

