const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const appDbUrl = process.env.LOCAL_HOST + "app";
let resolve1 = null;

let promise1 = (() => new Promise((resolve) => {
    resolve1 = resolve;
}))();



let appDb = mongoose.createConnection(appDbUrl, {useNewUrlParser: true, useCreateIndex: true}, () => {

    console.log('\x1b[36m%s\x1b[32m', "Load all central instances successfully!");
    console.log('\x1b[36m%s\x1b[32m', "Connect to mongoDB successfully!", appDbUrl);
    resolve1();
});


export const dbServices = {
    initDatabase: () => {
        return Promise.all([
            promise1
        ]).catch((err) => {
            console.log("Cannot connect to db");
            return Promise.reject(err);
        });
    },
    getDb: () => ({
        appDb
    })
};

