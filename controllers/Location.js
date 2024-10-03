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
        const json = request.body.data
        switch (json.type) {
            case 'CitySelect':
                await citySelect(json, response);
                break;
            case 'CountrySelect':
                await CountrySelect(json, response);
                break;
            default:
                // await TableSelect(json, response)
                break;
        }
    } catch (err) {
        console.log(err, "Error")
    }
}

const citySelect = async(json,response)=>{
    const pipeline = [];
    const match = {};
    if(json.CountryMID){
        match.CountryMID =new mongoose.Types.ObjectId(json.CountryMID)
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
            $project: { country: 0 , __v: 0}
        }
    );

    const city = await CitySchema.aggregate(pipeline);
    const Totalcounts = city.length
    const result= city.map(val =>({
       ...val,Totalcounts
     }))
    return response.send(result)
}

const CountrySelect = async(json,response)=>{
    const {index,page} = json
    let country = await CountrySchema.find({},{__v:0})
                  .skip((index-1)*page)
                  .limit(page)
    country = country.map(({ _id, CountryCode, CountryName, CountryID, currentDate, UpdatedtDate },i,array) => ({
        _id,
        CountryCode,
        CountryName,
        CountryID,
        currentDate,
        UpdatedtDate,
        Totalcounts:array.length,
      }));
    return response.send(country)
}