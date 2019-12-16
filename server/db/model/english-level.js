const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const englishLevelSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2", "e1", "e2", "g1", "g2"]
    }

});


module.exports = (db) => db.model("EnglishLevel", englishLevelSchema);