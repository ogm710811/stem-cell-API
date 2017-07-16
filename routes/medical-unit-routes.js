const express       = require('express');
const passport      = require('passport');
const bcrypt        = require('bcrypt');
const ensure        = require('connect-ensure-login');
const mongoose      = require('mongoose');
const MedicalUnit  = require('../models/medical-unit-model');

const medicalUnitRoutes = express.Router();

/*
    Define medical units routes
    *** ONLY SUPER ADMIN ROLE CAN CREATE AND UPDATE MEDICAL UNITS ***

    We want to provide basic authentication features, and along with login and logout methods
    we want to expose a way for the client to know if the user is logged in.

    We will define this API:
    METHOD      URL                 DESCRIPTION
    POST	    /medical-units  	Add new medical unit
    GET 	    /medical-units	    Returns all medical units
    GET 	    /medical-units/:id  Returns medical units with id
    PUT         /medical-units/:id  Edits medical units with id
    DELETE      /medical-units/:id  Deletes medical units with id
*/

/*******************************************************************************************************************/
// ROUTES HERE ...
/********************************************************************************************************************/
// 1. POST - Add new medical unit
medicalUnitRoutes.post('/api.stem/medical-units', (req, res, next) => {
  // if user not login never will get this action
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }
  
  const countryCode  = req.body.country;
  const name         = req.body.name;
  const address      = [req.body.street, req.body.city, req.body.state, req.body.zip];
  
  
  MedicalUnit.findOne(
    { name },
    { name : 1 },
    (err, foundMedicalUnit) => {
        if (err) {
            res.json(err);
            return;
        }
        // if was found does not create it
        if (foundMedicalUnit) {
            res.status(400).json({ message: `Sorry, the Medical Unit ${ foundMedicalUnit.name } already exist` });
            return;
        }
        //*********************************************************
        // no problem, then we are good to create new medical unit
        //********************************************************* 
        const theMedicalUnit = new MedicalUnit({
            countryCode: countryCode,
            name: name,
            address: address
        });
        console.log(theMedicalUnit.address[0]);

        theMedicalUnit.save((err) => {
            if (err) {
            res.json(err);
            return;
            }

            res.json({
            message: `New Medical Unit ${ theMedicalUnit.name } created successfully`,
            id: theMedicalUnit._id
            });
        });
    }
  );
});

// 2. GET - Returns all medical units
medicalUnitRoutes.get('/api.stem/medical-units', (req, res, next) => {
  // if user not login never will get this action
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  MedicalUnit.find((err, unitList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(unitList);
  });
});

// 3. GET - Returns medical units with id
medicalUnitRoutes.get('/api.stem/medical-units/:id', (req, res) => {
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
  
  MedicalUnit.findById(req.params.id, (err, theUnit) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theUnit);
    });
});

// 4. PUT - Edits medical units with id
medicalUnitRoutes.put('/api.stem/medical-units/:id', (req, res) => {
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

  const updatedMedicalUnit = {
    countryCode:  req.body.country,
    name:         req.body.name,
    address:      [req.body.street, req.body.city, req.body.state, req.body.zip]
  };
  
  MedicalUnit.findByIdAndUpdate(req.params.id, updatedMedicalUnit, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: `Medical Unit ${ updatedMedicalUnit.name } updated successfully`,
      id: updatedMedicalUnit._id
    });
  });
});

// 5. DELETE - Deletes medical units with id
medicalUnitRoutes.delete('/api.stem/medical-units/:id', (req, res) => {
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

  MedicalUnit.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: `Medical Unit deleted successfully`,
      id: req.params.id
    });
  });
});














module.exports = medicalUnitRoutes;