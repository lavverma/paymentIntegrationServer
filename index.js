require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { default: mongoose } = require("mongoose")
const app = express()

const route = require("./routes/route.js")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

mongoose.connect( process.env.MONGODB_LINK, {
    useNewUrlParser: true
} ) 
.then(()=>console.log(`MongoDB is connect`))
.catch(()=>console.log(`error`))

  
  app.use("/", route);


app.listen(process.env.PORT , ()=>{
    console.log(`sever running on ${process.env.PORT}`);
})