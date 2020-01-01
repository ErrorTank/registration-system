const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const registrationEventSchema = new Schema({
    studentGroup: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    childEvents: {
        type: [
            {
                from: {
                    type: Date,
                    required: true
                },
                delay: {
                    type: String,
                    default: "60000",
                },
                to: {
                    type: Date,
                    required: true
                }
            }
        ],
        required: true
    },
    year: {
        from: {
            type: Number,
            required: true,
        },
        to: {
            type: Number,
            required: true
        },
    },
    semester: {
        type: Number,
        enum: [0, 1, 2],
        required: true
    },
});


module.exports = (db) => db.model("RegistrationEvent", registrationEventSchema);