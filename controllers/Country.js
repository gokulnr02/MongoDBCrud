const Country = require('../MongoseDB/CountrySchema')

exports.CountrySave = async(request ,response)=>{
    try{
        const json = request.body.data;
    
        const CountryID={
            CountryID: (await Country.find({})).length ?(await Country.find().sort({ _id: -1 }).limit(1))[0].CountryID+1:1
        }
        console.log(CountryID)
        Country.create({...json,...CountryID}).then(res =>{ return response.status(200).json({"Output":{"status":{"code":200,"message":"Success"},"data":res}})})
    }catch(err){
        console.log(err.message)
    }
}
exports.CountrySelect = async(request ,response)=>{
    try{
        const json =request.body.data
        const page  =(json.index - 1) * json.count ;
        const count =json.count
        Country.find({},{__v:0}).skip(page).limit(count)
        .then(res =>{ return response.status(200).json({"Output":{"status":{"code":200,"message":"Success"},"data":res}})})
    }catch(err){
        console.log(err.message)
    }
}
