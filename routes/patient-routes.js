const express        = require('express');
const passport       = require('passport');
const bcrypt         = require('bcrypt');
const ensure         = require('connect-ensure-login');
const mongoose       = require('mongoose');
const Patient        = require('../models/patient-model');
const ensureLoggedIn = require('../lib/ensure-login');

const patientRoutes = express.Router();

/*
    Define patient routes
    
    We want to provide basic authentication features, and along with login and logout methods
    we want to expose a way for the client to know if the user is logged in.

    We will define this API:
    METHOD      URL             DESCRIPTION
    POST	    /patients     	Add new patient
    GET 	    /patients	    Returns all patients
    GET 	    /patients/:id   Returns patient with id
    PUT         /patients/:id   Edits patient with id
    DELETE      /patients/:id   Deletes patient with id
*/

/*******************************************************************************************************************/
// ROUTES HERE ...
/********************************************************************************************************************/
// POST - Add new patient
patientRoutes.post('/api.stem/patients', (req, res, next) => {
  //if user not login never will get this action
  // if (!req.isAuthenticated()) {
  //   res.status(403).json({ message: 'Unauthorized' });
  //   return;
  // }

  const pictureAddress  = req.body.pictureAddress;
  const firstName       = req.body.firstName;
  const lastName        = req.body.lastName;
  const birthDate       = req.body.birthDate;
  const address         = [req.body.street, req.body.city, req.body.state, req.body.zip];
  const email           = req.body.email;
  const phoneNumber     = req.body.phoneNumber;
  const condition       = req.body.condition;
  const procedure       = req.body.procedure;
  const deliveryMethod  = req.body.deliveryMethod;
  const followUp        = req.body.followUp;
  

  Patient.findOne(
    // IMPORTANT!!  Notice that we find the patient by his phone
    //              because the phone is unique value.
    { phoneNumber },
    { phoneNumber : 1 },
    (err, foundPatient) => {
        if (err) {
            res.json(err);
            return;
        }
        // if was found does not create it
        if (foundPatient) {
            res.status(400).json({ message: `Sorry, the patient ${ firstName } ${ lastName } already exist` });
            return;
        }

        //*********************************************************
        // no problem, then we are good to create new patient
        //********************************************************* 
        const thePatient = new Patient({
            pictureAddress: pictureAddress,
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            address: address,
            email: email,
            phoneNumber: phoneNumber,
            condition: condition,
            procedure: procedure,
            deliveryMethod: deliveryMethod,
            followUp: followUp,
        });

        thePatient.save((err) => {
            if (err) {
            res.json(err);
            return;
            }

            res.json({
            message: `New Patient ${ thePatient.firstName } ${ thePatient.lastName } created successfully`,
            id: thePatient._id
            });
        });
    }
  );
});

// GET - Returns all patients
patientRoutes.get('/api.stem/patients', (req, res, next) => {
  // if user not login never will get this action
  // if (!req.isAuthenticated()) {
  //   res.status(403).json({ message: 'Unauthorized' });
  //   return;
  // }

  Patient.find((err, patientList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(patientList);
  });
});

// GET - Returns all patient conditions in a medical unit
// Use at REPORTS - PATIENT CONDITION REPORT
patientRoutes.get('/api.stem/conditions', ensureLoggedIn, (req, res) => {
  Patient.find(
    {}, { condition : 1 })
    .sort({ condition : 1})
    .exec((err, allConditions) => {
      if (err) {
        res.status(500).json({ message: 'Conditions can not be retrieved at this moment' });
        return;
      }

      res.json(allConditions);
    });
});

// GET - Returns all patient procedure in a medical unit
// Use at REPORTS - PROCEDURES REPORT
patientRoutes.get('/api.stem/procedures', ensureLoggedIn, (req, res) => {
  Patient.find(
    {}, { procedure : 1 })
    .sort({ procedure : 1})
    .exec((err, allProcedures) => {
      if (err) {
        res.status(500).json({ message: 'Procedures can not be retrieved at this moment' });
        return;
      }

      res.json(allProcedures);
    });
});

// GET - Returns all patient delivery method applied in a medical unit
// Use at REPORTS - DELIVERY METHOD REPORT
patientRoutes.get('/api.stem/methods', ensureLoggedIn, (req, res) => {
  Patient.find(
    {}, { deliveryMethod : 1 })
    .sort({ deliveryMethod : 1})
    .exec((err, allMethods) => {
      if (err) {
        res.status(500).json({ message: 'Delivery Methods can not be retrieved at this moment' });
        return;
      }

      res.json(allMethods);
    });
});

// GET - Search for a patient with given phoneNumber
patientRoutes.get('/api.stem/patients/search',
(req, res) => {  
    // IMPORTANT!!  Notice that we find the patient by his phone
    //              because the phone is unique value.
    const phoneNumber = req.query.phoneNumber;

    Patient.findOne(
      { phoneNumber },

      (err, thePatient) => {
        if (err) {
          res.json(err);
          return;
        }

        // if wasn't found send a message to display
        if (!thePatient) {
            res.status(400).json({ message: `Sorry, the phone ${ phoneNumber } does not exist` });
            return;
        }

        res.json(thePatient);

      }
    );
});

// GET - Search for patients with given condition
patientRoutes.get('/api.stem/patients/search/condition',
(req, res) => {  
    // get the patient condition from the query params
    const condition = req.query.condition;

    Patient.find(
      { condition : condition },

      (err, patientList) => {
        if (err) {
          res.json(err);
          return;
        }

        // if wasn't found send a message to display
        if (!patientList) {
            res.status(400).json({ message: `Sorry, there was an error, try again later` });
            return;
        }

        res.json(patientList);

      }
    );
});

// GET - Search for patients with given procedure
patientRoutes.get('/api.stem/patients/search/procedure',
(req, res) => {  
    // get the patient procedure from the query params
    const procedure = req.query.procedure;

    Patient.find(
      { procedure : procedure },

      (err, patientList) => {
        if (err) {
          res.json(err);
          return;
        }

        // if wasn't found send a message to display
        if (!patientList) {
            res.status(400).json({ message: `Sorry, there was an error, try again later` });
            return;
        }

        res.json(patientList);

      }
    );
});

// GET - Search for patients with given method
patientRoutes.get('/api.stem/patients/search/method',
(req, res) => {  
    // get the patient procedure from the query params
    const method = req.query.method;

    Patient.find(
      { deliveryMethod : method },

      (err, patientList) => {
        if (err) {
          res.json(err);
          return;
        }

        // if wasn't found send a message to display
        if (!patientList) {
            res.status(400).json({ message: `Sorry, there was an error, try again later` });
            return;
        }

        res.json(patientList);

      }
    );
});

// GET - Returns patient with id
patientRoutes.get('/api.stem/patients/:id', (req, res) => {

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // 400 Bad Request
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  Patient.findById(req.params.id, (err, thePatient) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(thePatient);
    });
});

// PUT - Edits patient with id
patientRoutes.put('/api.stem/patients/:id', (req, res) => {
  // if user not login never will get this action
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // 400 Bad Request
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updatedPatient = {
    pictureAddress: req.body.pictureAddress,
    firstName:      req.body.firstName,
    lastName:       req.body.lastName,
    birthDate:      req.body.birthDate,
    address:        req.body.address,
    email:          req.body.email,
    phoneNumber:    req.body.phoneNumber,
    condition:      req.body.condition,
    procedure:      req.body.procedure,
    deliveryMethod: req.body.deliveryMethod,
    followUp:       req.body.followUp,
  };
  
  Patient.findByIdAndUpdate(req.params.id, updatedPatient, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: `Country ${ updatedPatient.firstName } ${ updatedPatient.lastName } updated successfully`,
      id: updatedPatient._id
    });
  });
});

// DELETE - Deletes patient with id
patientRoutes.delete('/api.stem/patients/:id', (req, res) => {
  // if user not login never will get this action
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // 400 Bad Request
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Patient.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: `Patient deleted successfully`,
      id: req.params.id
    });
  });
});

module.exports = patientRoutes;