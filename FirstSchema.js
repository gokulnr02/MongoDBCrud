const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        minlength:7
    },
    age: {
        type: Number,
        min: 1,
        max: 100
    },
    email: String,
    address: {
        district: String,
        state: String
    },
    hobbiees: [String],
    bestFriend:{
       type: mongoose.SchemaTypes.ObjectId,
       ref:"User"
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model("User", userSchema);

