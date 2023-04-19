import express,{Application,Request,Response} from "express"
import cors from "cors"
require("./utils/db")
const port = 4231;
import userRouter from "./router/userRouter"
const app:Application = express()
app.use(cors())
app.set("view engine", "ejs")
app.use(express.json())

app.get("/",(req:Request,res:Response): Response =>{
return res.status(200).json({message:"welcome to my api"})
})
app.get("/index", (req, res) => {
    return res.render("index")
})

app.use("/api/user", userRouter)

app.listen(port, (): void =>{
    console.log(`Listening to port ${port}`)
})
