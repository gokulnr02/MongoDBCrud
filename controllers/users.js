const user = require('../FirstSchema');


exports.userCreate = async (request , response) =>{
    try {
        const reqDetatils = request.body.data 
        const results = await user.create(reqDetatils)
        if(results){
            return response.status(200).json({"Output":{"data":results}})
        }
    } catch (error) {
           return response.status(400).json({"Output":{"data":error.message}})
    }
}

exports.userSelect = async (request , response) =>{
    try {
        const reqDetatils = request.body.data 
        // const results = await user.find({_id:"66d9ea346fd1147fec7742ce"},{__v:0}).populate("bestFriend",{__v:0})
        const results = await user.where("name").equals("Sri Gokul").where("age").lt(26).select("name")
        if(results){
            return response.status(200).json({"Output":{"data":results}})
        }
    } catch (error) {
           return response.status(400).json({"Output":{"data":error.message}})
    }
}