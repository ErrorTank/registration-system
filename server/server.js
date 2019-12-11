require("dotenv").config({path: "./env/dev.env"});
const https= require("https");
const fs = require("fs");
const path = require("path");
const createExpressServer = require("./config/express");
const app = createExpressServer({useCors: true});
const {initDatabase} = require("./config/db");
const createRoutes = require("./config/routes");
const createErrorHandlersMiddleware = require("./utils/error/error-handlers");

initDatabase().then(db => {
    let environment = process.env.NODE_ENV;
    let server = https.createServer(
        {
            key: fs.readFileSync(
                path.join(
                    __dirname,
                    `./ssl/${environment}/${process.env.SSL_KEY_PATH}`
                )
            ),
            cert: fs.readFileSync(
                path.join(
                    __dirname,
                    `./ssl/${environment}/${process.env.SSL_CRT_PATH}`
                )
            )
        },
        app
    );
    app.use("/", createRoutes(db));
    app.use(createErrorHandlersMiddleware);
    const port = process.env.PORT || 2000;
    server.listen(port, () => {

        console.log(`Server running on port: ${port}`)
    });
}).catch(err => {
    console.error(err);
});

