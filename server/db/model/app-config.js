const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appConfigSchema = new Schema({
    latestSchoolYear: {
        type: Number,
        required: true
    },

});




module.exports = db => db.model("AppConfig", appConfigSchema);