const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const registrationEventSchema = new Schema({
    studentGroup: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    }
});


module.exports = (db) => db.model("RegistrationEvent", registrationEventSchema);