const MongoseDB = require('mongoose');

const CitySchema = new MongoseDB.Schema({
    CityID:Number,
    CityName:String,
    CityCode:String,
    CountryID:Number,
    CountryMID:{
        type: MongoseDB.SchemaTypes.ObjectId,
        ref :"CountrySave"
     },
    CreatedDate:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },
    UpdatedDate:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    }

})
module.exports = MongoseDB.model("City",CitySchema)