const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const commonUserInfoSchema = new Schema({

    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
});


module.exports = (db) => db.model("CommonUserInfo", commonUserInfoSchema);