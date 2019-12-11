require("dotenv").config({path: "./env/dev.env"});
const https= require("https");
const fs = require("fs");
const path = require("path");
const app = configExpressServer({useCors: true});
import {dbServices} from "./config/db";
import {configExpressServer} from "./config/express";
import {importMainRoutes} from "./config/routes";
import {errorHandlersMiddleware} from "./utils/error/error-handlers";
const {initDatabase} = dbServices;

initDatabase().then(db => {

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
    app.use("/", importMainRoutes(db));
    app.use(errorHandlersMiddleware);
    const port = process.env.PORT || 2000;
    server.listen(port, () => {

        console.log(`Server running on port: ${port}`)
    });
}).catch(err => {
    console.error(err);
});

