const express       = require('express');
const passport      = require('passport');
const bcrypt        = require('bcrypt');
const ensure        = require('connect-ensure-login');
const mongoose      = require('mongoose');
const MedicalUnit  = require('../models/medical-unit-model');

const medicalUnitRoutes = express.Router();

/*
    Define country routes
    *** ONLY SUPER ADMIN ROLE CAN CREATE AND UPDATE COUNTRIES ***

    We want to provide basic authentication features, and along with login and logout methods
    we want to expose a way for the client to know if the user is logged in.

    We will define this API:
    METHOD      URL                 DESCRIPTION
    POST	    /medical-units  	Add new medical unit
    GET 	    /medical-units	    Returns all medical units
    GET 	    /medical-units/:id  Returns country with id
    PUT         /medical-units/:id  Edits country with id
    DELETE      /medical-units/:id  Deletes country with id
*/

/*******************************************************************************************************************/
// ROUTES HERE ...
/********************************************************************************************************************/
// 1. POST - Add new medical unit
medicalUnitRoutes.post('/medical-units', (req, res, next) => {
  // if user not login never will get this action
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }
  
  const countryCode  = req.body.country;
  const name         = req.body.name;
  const address      = [req.body.street, req.body.city, req.body.state, req.body.zip]
  
  
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
















module.exports = medicalUnitRoutes;