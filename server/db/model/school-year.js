const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schoolYearSchema = new Schema({
    name: {
        type: Number,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: true
    },

});




module.exports = db => db.model("SchoolYear", schoolYearSchema);