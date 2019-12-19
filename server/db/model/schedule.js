const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const scheduleSchema = new Schema({
    items: {
        type: [
            {
                type: ObjectId,
                ref: "SchoolScheduleItems",
                required: true,
            }
        ],
        required: true
    },
    owner: {
        type: ObjectId,
        ref: "StudentInfo",
        required: true
    }
});


module.exports = (db) => db.model("Schedule", scheduleSchema);