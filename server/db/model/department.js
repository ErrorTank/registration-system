const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const departmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pricePerCredit: {
        type: Number,
        required: true
    }
});


module.exports = (db) => db.model("Department", departmentSchema);