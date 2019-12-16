const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const shiftSchema = new Schema({
    name: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
});


module.exports = (db) => db.model("Shift", shiftSchema);