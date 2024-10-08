const express = require('express');
const routes = express.Router();

const userModule = require('./controllers/users');
const Country =require('./controllers/Country');
const City =require('./controllers/City');
const Location =require('./controllers/Location');
const Building = require('./controllers/Building')

routes.post('/userCreate',userModule.userCreate)
routes.post('/userSelect',userModule.userSelect);
routes.post('/CountrySave',Country.CountrySave);
routes.post('/CountrySelect',Country.CountrySelect);
routes.post('/CitySave',City.CitySave);
routes.post('/CitySelect',City.CitySelect);
routes.post('/LocationSave',Location.LocationSave);
routes.post('/LocationSelect',Location.LocationSelect);
routes.post('/BuildingSave',Building.BuildingSave);
routes.post('/BuildingSelect',Building.BuildingSelect);

module.exports = routes ;