const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const specialitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    pricePerCredit: {
        type: [
            {
                schoolYear: {
                    type: ObjectId,
                    ref: "SchoolYear",

                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});






module.exports = (db) => db.model("Speciality", specialitySchema) ;