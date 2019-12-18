const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appConfigSchema = new Schema({
    currentSchoolYear: {
        type: Number,
        required: true
    }

});




module.exports = db => db.model("AppConfig", appConfigSchema);