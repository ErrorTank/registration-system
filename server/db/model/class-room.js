const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const classRoomSchema = new Schema({
   name: {
       type: String,
       required: true
   },

});






module.exports = (db) => db.model("ClassRoom", classRoomSchema) ;