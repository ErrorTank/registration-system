const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appConfigSchema = new Schema({
    latestSchoolYear: Number
});




module.exports = db => db.model("AppConfig", appConfigSchema);