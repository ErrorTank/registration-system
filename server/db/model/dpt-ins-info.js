const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const dptInsInfoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    department: {
        type: ObjectId,
        ref: "Department",
        required: true
    },
    identityID: {
        type: String
    }
});


module.exports = (db) => db.model("DptInsInfo", dptInsInfoSchema);