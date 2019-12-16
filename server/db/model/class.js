const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const classSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: ObjectId,
        ref: "Subject",
        required: true
    }
});


module.exports = (db) => db.model("Class", classSchema);