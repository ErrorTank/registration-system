const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appConfigSchema = new Schema({
    latestSchoolYear: {
        type: Number,
        required: true
    },
    currentSemester: {
        type: Number,
        enum: [0, 1, 2],
        required: true
    },
    pricePerCredit: {
        type: [
            {
                schoolYear: {
                    type: Number

                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ]
    }

});




module.exports = db => db.model("AppConfig", appConfigSchema);