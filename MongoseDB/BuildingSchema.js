const mongoose = require('mongoose');

const buidingSchema = new mongoose.Schema({
    BuildingCode:String,
    BuildingName:String,
    BuildingID:Number,
    LocationMID:{
        type:mongoose.Types.ObjectId,
        ref:'LocationSave'
    },
    CityMID:{
        type:mongoose.Types.ObjectId,
        ref:'City'
    },
    CountryMID:{
        type:mongoose.Types.ObjectId,
        ref:'CountrySave'
    },
    CreatedDate:{
        type:Date,
        default:()=>Date.now(),
        immutable:true
    },
    UpdatedDate:{
        type:Date,
        default:()=>Date.now(),
    }
})

module.exports = mongoose.model('BuildingSave',buidingSchema)