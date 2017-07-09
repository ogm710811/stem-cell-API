const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const countrySchema = new Schema({
    code: {
        type : String,
        // use ISO country code
    },
    name: {
        type : String,
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