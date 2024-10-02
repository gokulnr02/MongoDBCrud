const Location = require('../MongoseDB/LocationSchema');
const CitySchema = require('../MongoseDB/CitySchema');
const CountrySchema = require('../MongoseDB/CountrySchema');

const mongoose = require('mongoose')
exports.LocationSave = async (request, response) => {
    try {

    } catch (err) {
        console.log(err, "Error")
    }
}

exports.LocationSelect = async (request, response) => {
    try {
        //  const city =await CitySchema.where("_id").equals("66fadc1469f97a4c3a6e5803")
        const CountryMID = "66fadb2669f97a4c3a6e57f5";
        const pipeline = [];
        const match = {};

        if(CountryMID){
            match.CountryMID =new mongoose.Types.ObjectId(CountryMID)
        }

        pipeline.push(
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'countrysaves',
                    localField: 'CountryMID',
                    foreignField: '_id',
                    as: 'country'
                }
            },
            {
                $unwind: { path: "$country", preserveNullAndEmptyArrays: true }
            },
            {
                $project: { __v: 0 }
            },
            {
                $addFields: {
                    "CountryName": "$country.CountryName",
                    "CountryCode": "$country.CountryCode",
                }
            },
            {
                $project: { country: 0 }
            }
        );

        const city = await CitySchema.aggregate(pipeline);

        return response.send(city)
    } catch (err) {
        console.log(err, "Error")
    }
}