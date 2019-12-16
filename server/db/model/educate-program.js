const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const educateProgramSchema = new Schema({
    subjects: {
        type: [
            {
                type: ObjectId,
                ref: "Subject",
                required: true
            }
        ],
        required: true
    },

});


module.exports = (db) => db.model("EducateProgram", educateProgramSchema);