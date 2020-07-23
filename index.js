const express = require('express')
const morgan = require('morgan')
const yup = require('yup')
const helmet = require('helmet')
const cors = require('cors')
const monk = require('monk')
const util = require('util')


var validUrl = require("valid-url");
const { MongoError } = require('mongodb')
require("dotenv").config();

 

const app = express();


const db = monk(process.env.MONGODB_URI);

db.addMiddleware(require('monk-middleware-debug'))

const urls = db.get("urls");
urls.createIndex({ slug: 1 }, { unique: true });


console.log("objects"+util.inspect(urls, {showHidden: false, depth: null}))


urlsCollection= [
      
       { url:"abdennoururl.com",
        slug:"hhhh"},

]
/*db.get("urls").insert({ url:"abdennoururl.com",
slug:"hbhhh"}).then((res)=> {

        
        console.log("Number of documents inserted: " + res.insertedCount);
        db.close();
      }).catch((err)=>{

                console.log("ERROR"+err)
      });

      */





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






