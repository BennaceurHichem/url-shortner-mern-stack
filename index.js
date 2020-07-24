const express = require('express')
const morgan = require('morgan')
const yup = require('yup')
const helmet = require('helmet')
const cors = require('cors')
const monk = require('monk')
const util = require('util')
const path = require("path");
var bodyParser = require('body-parser');

const { nanoid } = require("nanoid");







var validUrl = require("valid-url");
const { MongoError } = require('mongodb')
require("dotenv").config();

 

const app = express();


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({
        extended: false
     }));

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
//app.use(cors())
app.use(express.json())
//define te static folder for the server side 
app.use(express.static('./public'));



const errorPage = path.join(__dirname, "public/404.html");





///cors policy managment middleware 
 //CORS Should be restricted
 app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
      });





app.get('/:id',async (req,res,next)=>{

        const { slug } = req.params;

        const existing = await urls.findOne({ slug });
        if (existing) {
            res.redirect(existing.url);
        } else {
            res.status(404).sendFile(errorPage);
        }
       

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
        }else{
                        //check if the slug exist in the database 
                        const existing = await urls.findOne({ slug });
                        if (existing) {
                                return res.status(404).send({ error: `Slug ${slug} in use. 🍔` });
                          }
        }
  

        const created = urls.insert({ slug: slug, url: url }).then(docs => {
            // send feed back
            res.json(docs);
        })
        .catch(err => {
            return res.status(404).send({ error: err });
            next(error);

        });



})




//error is e=sent from the app.get above 
app.use((error, req, res, next) => {
        if (error.status) {
          res.status(error.status);
        } else {
          res.status(500);
        }
        res.json({
          message: error.message,
          stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
        });
      });

      




const port = process.env.PORT || 1337;

//configurin server listening 
app.listen(port,()=>{

console.log(`Listening at http://localhost:${port}`);

});






