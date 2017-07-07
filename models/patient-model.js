const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const patientSchema = new Schema({
    unit_id: {
        type : Schema.Types.ObjectId,
        // medical unit where the patient is located
        // this value is a reference from medical-unit model
    },
    photoAddress: { 
        type : String 
    }, 
    firstName: {
        type : string,
    },
    lastName: {
        type : string,
    },
    birthDate: {
        type : date 
    },
    address: {
        street: { type : string },
        city:   { type : string },
        state:  { type : string },
        zip:    { type : string }
    },
    email: {
        type: String, required: true, unique: true
    },
    condition: {
        type: String, required: true,
        enum: ['COPD', 'ED', 'OC', 'EY', 'AI', 'DT2', 'SCI', 'TBI']
        // patient condition :
        /*
            COPD : CHRONIC OBSTRUCTIVE PULMONARY DISEASE
            ED   : ERECTILE DYSFUNCTION
            OC   : ORTHOPEDIC CONDITION
            EY   : EYES
            AI   : AUTO INMUNE
            DT2  : DIABETES TYPE 2
            SCI  : SPINAL CORD INJURY
            TBI  : TRAUMATIC BRAIN INJURY
        */
    },
    procedure: {
        type: String, required: true,
        enum: ['Adipose Derived Stem Cell', 'Bone Marrow']
        // type of procedures to apply to a patient. The procedure to apply is
        // related with the patient condition. Could be both. Those procedures
        // are the sources of stem cells.
    },
    deliveryMethod: {
        type: String, required: true,
        enum: ['IVN', 'IAR', 'IAC', 'ITC', 'ILS', 'LFT', 'LHD', 'LPN', 'LFC', 'LEY']
        // patient condition :
        /*
            IVN : Intravenous
            IAR : Intra Arterial
            IAC : Intra Articular
            ITC : Intrathecal
            ILS : Intralesional
            LFT : Localized Fat Transfer
            LHD : Localized Head
            LPN : Localized Penis
            LFC : Localized Facial
            LEY : Localized Eyes
        */
    },
    followUp: [{
        type:   { type : string },
        result: { type : string },
        date:   { type : date }
    // every patient will have until 5 follow up
    /*
        type: phone call or questionnaire
        result: scale from 1 to 5
        date: date follow up was applied
    */
    }]
},
{ 
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;