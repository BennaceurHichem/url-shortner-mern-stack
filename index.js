const express = require('express')
const morgan = require('morgan')
const yup = require('yup')
const helmet = require('helmet')
const cors = require('cors')
const monk = require('monk')
const util = require('util')


var validUrl = require("valid-url");
require("dotenv").config();

 

const app = express();


const db = monk(process.env.MONGODB_URI);
const urls = db.get("urls");
urls.createIndex({ slug: 1 }, { unique: true });


console.log("objcts"+util.inspect(urls, {showHidden: false, depth: null}))




app.use(helmet())
//logger with tiny message 
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
//define te static folder for the server side 
app.use(express.static('./public'));





app.get('/:id',(req,res,next)=>{

        
        res.json({
        message:"ben shortner, SHORT URLs for your life as a googler"

       

        })
       

});


app.post('/url',(req,res,next)=>{


})



/*
//cors policy managment middleware 
 //CORS Should be restricted
 app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
      });

*/


const port = process.env.PORT || 1337;

//configurin server listening 
app.listen(port,()=>{

console.log(`Listening at http://localhost:${port}`);

});






