const express = require('express');
const app = express();
const Port = 5001;
const mongoDB = require('mongoose');
Main().then(()=>{console.log("Db connected")})
const routes = require('./routes');
const cors=require('cors')
app.use(cors('*'))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use('/',routes)
app.use('/',(req,res,next)=>{
    console.log("Middlewere");
    next()
})


async function Main(){
    await mongoDB.connect('mongodb://127.0.0.1:27017/test')
}
app.listen(Port, ()=>{console.log(`Server listen in ${Port}`)});


module.exports = app ;