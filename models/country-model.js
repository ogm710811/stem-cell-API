const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const countrySchema = new Schema({
    country_id: {
        type : string,
        // use ISO country code
    },
    name: {
        type : string,
        // the name of the country
    },    
},
{ 
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;