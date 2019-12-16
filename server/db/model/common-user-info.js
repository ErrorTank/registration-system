const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const commonUserInfoSchema = new Schema({
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
        required: true,
        unique: true
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
    identityID: {
        type: String,
        unique: true
    }
});


module.exports = (db) => db.model("CommonUserInfo", commonUserInfoSchema);