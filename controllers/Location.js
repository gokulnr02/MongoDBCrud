const Location = require('../MongoseDB/LocationSchema')

exports.LocationSave = async (request, response) => {
    try {

    } catch (err) {
        console.log(err, "Error")
    }
}

exports.LocationSelect = async (request, response) => {
    try {
        const result = await Location.aggregate([
            {
                $match: {}
            },
            {
                $lookup: {
                    from: 'cities',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'CityDocuments'
                }
            },
            {
                $project: {
                    CityDocuments: 1
                }
            },
            {
                $unwind: {
                    path: '$CityDocuments',
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $group: {
                    '_id': '_id',
                    cities: { $push: "$CityDocuments" }
                }
            }

        ])
        return response.send(result)
    } catch (err) {
        console.log(err, "Error")
    }
}