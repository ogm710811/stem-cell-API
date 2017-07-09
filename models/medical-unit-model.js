const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const medicalUnitSchema = new Schema({
    country_id: {
        type : Schema.Types.ObjectId,
        // country where the clinic is located
        // this value is a reference from country model
    },
    countryCode: {
        type      : String,
        uppercase : true,
        required  : [ true, 'Please, enter a country code' ]
    },
    name: {
        type : String,
        required : [ true, 'Please, enter a medical unit name' ]
        // the name of the clinic
    },
    address: {
        type : Array, default : [],
        required : [ true, 'Please, enter a full address' ]
    }
    // full address requirew street, city, state, and zip code
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const MedicalUnit = mongoose.model('Unit', medicalUnitSchema);
module.exports = MedicalUnit;