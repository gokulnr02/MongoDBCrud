const BuildingSave = require('../MongoseDB/BuildingSchema');
const { CountrySelect } = require('./Country');
const { CitySelect } = require('./City');
const { LocationSelect } = require('./Location');

exports.BuildingSave = async (request, response) => {
    try {
        const json = request.body.data
        const BuildingID = await BuildingSave.countDocuments();
        json.BuildingID = BuildingID + 1
        await BuildingSave.create(json).then(res => {
            return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": res } })
        })

    } catch (err) {
        return response.status(200).json({ "Output": { "status": { "code": 200, "message": err.message }, "data": [] } })
    }
}

exports.BuildingSelect = async (request, response) => {
    try {
        const json = request.body.data;
        switch (json.type) {
            case 'CountrySelect':
                await CountrySelect(request, response);
                break;
            case 'CitySelect':
                await CitySelect(request, response);
                break;
            case 'LocationSelect':
                await LocationSelect(request, response);
                break;
            default:
                await TableSelect(json, response)
                break;
        }
    } catch (err) {
        return response.status(200).json({ "Output": { "status": { "code": 200, "message": err.message }, "data": [] } })
    }
}

async function TableSelect(json, response) {
   const result =  await BuildingSave.aggregate([
        {
            $lookup: {
              from:'countrysaves',
              foreignField:'_id',
              localField:'CountryMID',
              as:'country'
            }
        },
        {
            $lookup: {
              from:'cities',
              foreignField:'_id',
              localField:'CityMID',
              as:'city'
            }
        },
        {
            $lookup: {
              from:'locationsaves',
              foreignField:'_id',
              localField:'LocationMID',
              as:'location'
            }
        },
        {
            $unwind:{
                path:'$country',
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $unwind:{
                path:'$city',
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $unwind:{
                path:'$location',
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $addFields:{
                'LocationName':'$location.LocationName',
                'LocationCode':'$location.LocationCode',
                'CityName':'$city.CityName',
                'CityCode':'$city.CityCode',
                'CountryName':'$country.CountryName',
                'CountryCode':'$country.CountryCode',
            }
        },
        {
            $project:{
                __v:0,
                country:0,
                city:0,
                location:0
            }
        },
        {
            $group:{
                '_id':'_id',
                'totalcounts':{
                    $sum:1
                },
                documents:{$push:'$$ROOT'}
            }
        },
        {
            $unwind:{
                path:'$documents',
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $addFields:{
                'documents.Totalcounts':'$totalcounts'
            }
        },
        {
            $replaceRoot:{newRoot:'$documents'}
        }

    ])
    return response.status(200).json({ "Output": { "status": { "code": 200, "message": 'Success' }, "data": result } })
}