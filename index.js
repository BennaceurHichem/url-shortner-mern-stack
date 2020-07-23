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

//
db.on("open", () => {
        console.log("Database connected.");
    });



db.addMiddleware(require('monk-middleware-debug'))

const urls = db.get("urls");
urls.createIndex({ slug: 1 }, { unique: true });


console.log("objects"+util.inspect(urls, {showHidden: false, depth: null}))


app.use(helmet())
//logger with tiny message 
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
//define te static folder for the server side 
app.use(express.static('./public'));



const errorPage = path.join(__dirname, "public/404.html");





app.get('/:id',(req,res,next)=>{

        
        res.json({
        message:"ben shortner, SHORT URLs for your life as a googler"

       

        })
       

});


app.post('/url', async (req,res,next)=>{

        let { slug, url } = req.body;

        if (!url) {
                return res.status(400).send({ error: "url is required" });
            }
        // Check if the image_url is a valid url.
        if (!validUrl.isUri(url)) {
                return res.status(400).send({ error: "url must be a valid url" });
        }

        if (!slug) {
                // generate a random slug
                slug = nanoid(5);
                slug = slug.toLowerCase();
        }
        //check if the slug exist in the database 
        const existing = await urls.findOne({ slug });
        if (existing) {
                return res.status(404).send({ error: "Slug in use. 🍔" });
        }

        const created = urls.insert({ slug: slug, url: url }).then(docs => {
            // send feed back
            res.json(docs);
        })
        .catch(err => {
            return res.status(404).send({ error: err });
        });



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






