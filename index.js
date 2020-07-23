const express = require('express')
const morgan = require('morgan')
const yup = require('yup')
const helmet = require('helmet')
const cors = require('cors')




const app = express();
app.use(helmet())
//logger with tiny message 
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())



app.get('/',(req,res)=>{

        res.json({
        message:"ben shortner, SHORT URLs for your life as a googler"

        })

});



const port = process.env.PORT || 1337;

//configurin server listening 
app.listen(port,()=>{

console.log(`Listening att http://localhost:${port}`);

});




