const City = require('../MongoseDB/CitySchema')
const mongoose = require('mongoose')

exports.CitySave = async (request, response) => {
  try {
    let json = request.body.data;
    if (json.CityID) {
      json.CityID = await City.find({}).sort(-1).limit(1)[0].CityID + 1
    } else json.CityID = 1

    json.CountryMID = new mongoose.Types.ObjectId(json.CountryMID);
    console.log("json", json)
    await City.create(json).then((res) => { return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": res } }) })
  } catch (err) {
    console.log(err.message)
  }
}

exports.CitySelect = async (request, response) => {
  try {
    const result = await City.aggregate([
      {
        $lookup: {
          from: "countrysaves",
          localField: "CountryMID",
          foreignField: "_id",
          as: "country"
        }
      }, {
        $unwind: {
          "path": "$country"
        }
      },
      {
        $addFields: {
          "TotalCountDocuments": "$TotalCount",
          "CountryName": "$country.CountryName",
          "CountryCode": "$country.CountryCode",
          "CountryID": "$country.CountryID"
        }
      },
      {
        $project: {
          country: 0,
          __v: 0
        }
      },
      {
        $group: {
          "_id": "_id",
          "TotalCount": {
            $sum: 1
          },
          "documents": { $push: "$$ROOT" }
        }
      }, 
      {
        $unwind: {
          "path": "$documents"
        }
      }, {
        $addFields: {
          "documents.Totalcounts": "$TotalCount"
        }
      }, {
        $replaceRoot: {
          newRoot: "$documents"
        }
      }
    ]).then(res => { return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": res } }) })
  } catch (err) {
    console.log(err.message)
  }
}
