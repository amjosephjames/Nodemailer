import mongoose from "mongoose"
const URL:string = "mongodb://localhost/nodemailer"
mongoose.connect(URL).then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err)
})