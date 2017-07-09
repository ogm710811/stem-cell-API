const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const countrySchema = new Schema({
    code: {
        type : String,
        uppercase : true,
        required  : [ true, 'Please, enter a country code' ]
        // use ISO country code
    },
    name: {
        type : String,
        required  : [ true, 'Please, enter a country code' ]
        // the name of the country
    },    
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;