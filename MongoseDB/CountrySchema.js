const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    CountryCode:String,
    CountryName:String,
    CountryID:Number,
    currentDate:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    },
    UpdatedtDate:{
        type:Date,
        default:()=>Date.now()
    }
})
module.exports = mongoose.model('CountrySave',CountrySchema);