const express    = require('express');
const passport   = require('passport');
const bcrypt     = require('bcrypt');
const ensure     = require('connect-ensure-login');
const mongoose   = require('mongoose');
const Country    = require('../models/country-model');

const countryRoutes = express.Router();

/*
    Define country routes
    *** ONLY SUPER ADMIN ROLE CAN CREATE AND UPDATE COUNTRIES ***

    We want to provide basic authentication features, and along with login and logout methods
    we want to expose a way for the client to know if the user is logged in.

    We will define this API:
    METHOD      URL             DESCRIPTION
    POST	      /countries  	  Add new country
    GET 	      /countries	    Returns all countries
    GET 	      /countries/:id  Returns country with id
    PUT         /countries/:id  Edits country with id
    DELETE      /countries/:id  Deletes country with id
*/

/*******************************************************************************************************************/
// ROUTES HERE ...
/********************************************************************************************************************/
// 1. POST - Add new country
countryRoutes.post('/api.stem/countries', (req, res, next) => {
  // if user not login never will get this action
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  const code = req.body.code;
  const name = req.body.name;

  Country.findOne(
    { name },
    { name : 1 },
    (err, foundCountry) => {
        if (err) {
            res.json(err);
            return;
        }
        // if was found does not create it
        if (foundCountry) {
            res.status(400).json({ message: `Sorry, the country ${ foundCountry.name } already exist` });
            return;
        }

        //*********************************************************
        // no problem, then we are good to create new country
        //********************************************************* 
        const theCountry = new Country({
            code: code,
            name: name,
        });

        theCountry.save((err) => {
            if (err) {
            res.json(err);
            return;
            }

            res.json({
            message: `New Country ${ theCountry.name } created successfully`,
            id: theCountry._id
            });
        });
    }
  );
});

// 2. GET - Returns all countries
countryRoutes.get('/api.stem/countries', (req, res, next) => {
  // if user not login never will get this action
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  Country.find((err, countryList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(countryList);
  });
});

// 3. GET - Returns country with id
countryRoutes.get('/api.stem/countries/:id', (req, res) => {
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
  
  Country.findById(req.params.id, (err, theCountry) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theCountry);
    });
});

// 4. PUT - Edits country with id
countryRoutes.put('/api.stem/countries/:id', (req, res) => {
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

  const updatedCountry = {
    code: req.body.code,
    name: req.body.name,
  };
  
  Country.findByIdAndUpdate(req.params.id, updatedCountry, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: `Country ${ updatedCountry.name } updated successfully`,
      id: updatedCountry._id
    });
  });
});

// 5. DELETE - Deletes country with id
countryRoutes.delete('/api.stem/countries/:id', (req, res) => {
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

  Country.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: `Country deleted successfully`,
      id: req.params.id
    });
  });
});

module.exports = countryRoutes;