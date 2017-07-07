const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const medicalUnitSchema = new Schema({
    country_id: {
        type : Schema.Types.ObjectId,
        // country where the clinic is located
        // this value is a reference from country model
    },
    name: {
        type : string,
        // the name of the clinic
    },
    address: {
        street: { type : string },
        city:   { type : string },
        state:  { type : string },
        zip:    { type : string }
    }
},
{ 
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Medical_Unit = mongoose.model('Medical_Unit', medicalUnitSchema);
module.exports = Medical_Unit;