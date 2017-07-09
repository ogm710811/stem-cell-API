const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
unit_id: {
    type : Schema.Types.ObjectId,
    // medical unit where the user is located
    // this value is a reference from medical-unit model
},
username: { 
    type     : String,
    required : [ true, 'Please, enter a username' ]
},
encryptedPassword: { 
    type     : String 
},
fullName: { 
    type     : String, 
    required : [ true, 'Please, enter a full name' ]
},
role: {
    type: String, default: 'regular user',
    enum: [ 'regular user', 'unit admin', 'super admin' ],    
    /*
    Super Administrator:
        Can create countries and medical units.
        Can set password expiration.
    Unit Administrator:
        Can create users for his Medical Unit.
        Can set password expiration for his Medical Unit.
    Regular User:
        Can create patient profiles.
    */
},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;