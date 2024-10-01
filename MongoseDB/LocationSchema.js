const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    LocationCode :String,
    LocationName :String,
    LocationID:Number,
    CountryID:Number,
    CityID:Number,
    CountryMID :{
        type:mongoose.Types.ObjectId,
        ref:"CountrySave"
    },
    CityMID:{
        type:mongoose.Types.ObjectId,
        ref:"City"
    },
    CreatedDate:{
        type:Date,
        default :()=>Date.now(),
        immutable:true
    },
    UpdatedDate:{
        type:Date,
        default :()=>Date.now()
    }
})

LocationSchema.virtual('cities', {
    ref: 'City',
    localField: 'CityMID',
    foreignField: '_id',
    justOne: false
  });

module.exports = mongoose.model('LocationSave',LocationSchema)