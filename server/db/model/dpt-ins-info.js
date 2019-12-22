const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const dptInsInfoSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    division: {
        type: ObjectId,
        ref: "Division",
        // required: true
    },

});


module.exports = (db) => db.model("DptInsInfo", dptInsInfoSchema);