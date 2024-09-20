const City = require('../MongoseDB/CitySchema')

exports.CitySave = async (request, response) => {
    try {
        let json = request.body.data;
        if (json.CityID) {
            json.CityID = await City.find({}).sort(-1).limit(1)[0].CityID + 1
        } else json.CityID = 1
        console.log("json",json)
        await City.create( json ).then((res) => { return response.status(200).json({ "Output": { "status": { "code": 200, "message": "Success" }, "data": res } }) })
    } catch (err) {
        console.log(err.message)
    }
}
exports.CitySelect = async (request, response) => {
    try {
        await City.find({}).populate("CountryMID").then(res => {
            console.log(res, 'CitySelect');
          }).catch(err => {
            console.error('Error in lookup aggregation:', err);
          });
          
    } catch (err) {
        console.log(err.message)
    }
}
