const Location = require('../MongoseDB/LocationSchema');
const CitySchema = require('../MongoseDB/CitySchema');
const CountrySchema = require('../MongoseDB/CountrySchema');

const mongoose = require('mongoose')
exports.LocationSave = async (request, response) => {
    try {
        const json = request.body.data

        let LocationID = await Location.countDocuments()
        console.log(LocationID, 'Total')

        json.LocationID = LocationID + 1
        console.log(json)
        const result = await Location.create(json)
        return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": result } })
    } catch (err) {
        console.log(err, "Error")
    }
}

exports.LocationSelect = async (request, response) => {
    try {
        //  const city =await CitySchema.where("_id").equals("66fadc1469f97a4c3a6e5803")
        const json = request.body.data
        switch (json.type) {
            case 'CitySelect':
                await citySelect(json, response);
                break;
            case 'CountrySelect':
                await CountrySelect(json, response);
                break;
            default:
                await TableSelect(json, response)
                break;
        }
    } catch (err) {
        console.log(err, "Error")
    }
}

async function TableSelect(json, response) {

    const pipeLine = [];
    if(json.CountryMID){
        pipeLine.push({
            $match:{
              'CountryMID':new mongoose.Types.ObjectId(json.CountryMID)
            }
        })
    }
    if(json.CityMID){
        pipeLine.push({
            $match:{
              'CityMID':new mongoose.Types.ObjectId(json.CityMID)
            }
        })
    }
    pipeLine.push(
        {
            $lookup: {
                from: 'countrysaves',
                localField: 'CountryMID',
                foreignField: '_id',
                as: 'country'
            }
        },
        {
            $lookup: {
                from: 'cities',
                localField: 'CityMID',
                foreignField: '_id',
                as: 'city'
            }
        },
        {
            $unwind: {
                path: "$country"
            }
        },
        {
            $unwind: {
                path: "$city"
            }
        },
        {
            $project: {
                "_id": 1,
                "LocationCode": 1,
                "LocationName": 1,
                "LocationID": 1,
                "CityCode": "$city.CityCode",
                "CityName": "$city.CityName",
                "CityID": "$city.CityID",
                "CityMID": 1,
                "CountryName": "$country.CountryName",
                "CountryCode": "$country.CountryCode",
                "CountryID": "$country.CountryID",
                "CountryMID": 1,

            },

        },
        {
            $group: {
                '_id': '_id',
                'totalcounts': {
                    $sum: 1
                },
                "documents": { "$push": "$$ROOT" }
            }
        }, {
            $unwind: {
                path: "$documents"
            }
        },
        {
            $addFields: {
                'documents.totalcounts': "$totalcounts"
            }
        },
        {
            $replaceRoot: { newRoot: "$documents" }
        }

    )
    const result = await Location.aggregate(pipeLine)
    return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": result } })
}

const citySelect = async (json, response) => {
    const pipeline = [];
    const match = {};
    if (json.CountryMID) {
        match.CountryMID = new mongoose.Types.ObjectId(json.CountryMID)
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
            $addFields: {
                "CountryName": "$country.CountryName",
                "CountryCode": "$country.CountryCode",
            }
        },
        {
            $project: { country: 0, __v: 0 }
        }
    );

    const city = await CitySchema.aggregate(pipeline);
    const Totalcounts = city.length
    const result = city.map(val => ({
        ...val, Totalcounts
    }))
    return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": result } })
}

const CountrySelect = async (json, response) => {
    const { index, page } = json
    let country = await CountrySchema.find({}, { __v: 0 })
        .skip((index - 1) * page)
        .limit(page)
    country = country.map(({ _id, CountryCode, CountryName, CountryID, currentDate, UpdatedtDate }, i, array) => ({
        _id,
        CountryCode,
        CountryName,
        CountryID,
        currentDate,
        UpdatedtDate,
        Totalcounts: array.length,
    }));
    return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": country } })
}