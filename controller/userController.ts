import { Request, Response } from "express"
import nodemailer from "nodemailer"
import ejs from "ejs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../model/userModel"
import crypto from "crypto"
import path from "path"
require("dotenv").config()


type myUSER = {
    userName: string,
    email: string,
    password: string,
    isVerifried: boolean,
    verified: string,
    _id?: string,
    _doc?: any
}

const transport = nodemailer.createTransport({
    host: 'htht.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth : {
        user : "amjoseph4231@gmail.com",
        pass: "Barca4231"
    }
})

const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await userModel.find()

        return res.status(200).json({
            status: "Success",
            data: user
        })
    } catch (error) {
        return res.status(404).json({
            status: "Failed",
            message: error
        })
    }
}

const createUser = async (req:Request, res:Response):Promise<Response> => {
    try {
        const { userName, email, password } = req.body
        
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)

        const data = await crypto.randomBytes(10).toString("hex")
        const token = await jwt.sign({data}, "mySecrete", {expiresIn: "1d"})
        const userCreate: myUSER | null = await userModel.create({
            userName,
            email,
            password: hashed,
            verified: token,
            isVerifried: false
        })

const tokens =  jwt.sign({name:userCreate?.userName,id:userCreate?._id},"Secret",{expiresIn:"1d"})

        const myID = userCreate._id
        const myToken = userCreate.verified
        const file = path.join(__dirname, "../views/index.ejs")

        ejs.renderFile(file,{myID,myToken},(err,data)=>{
            if(err){
                console.log(err)
            }else{
                const mailOption = {
                    from:"my-Dev",
                    to:email,
                    subject:"Account verification",
                    html:`${userCreate._id} and ${userCreate.verified}`
                   }
    
                   transport.sendMail(mailOption,(err,info)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("mail sent",info.response)
                    }
                   })
            }
           })

        return res.status(201).json({
            status: "Success",
            data: userCreate
        })
    } catch (error) {
        return res.status(404).json({
            status: "Failed",
            message: error
        })
        console.log(error)
    }
}


const verifyUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {verified} = req.body
        const user: myUSER | null = await userModel.findById(req.params.id)

        if (user) {
            if (user.verified != "") {
                await userModel.findByIdAndUpdate(user._id, {
                    isVerifried: true,
                    verified: ""
                }, { new: true })
                
                return res.status(200).json({
                    message:"User is now verified"
                })
            } else {
                return res.status(500).json({
                    message:"user is not verified"
                })
            }
        } else {
            return res.json({
                message:"User have not signed up yet"
            })
        }
    } catch (err) {
        return res.status(400).json({
            message: err
        })
    }
}

const signInUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        
        if (user) {
            const check = await bcrypt.compare(password, user.password)
            if (check) {
                if (user.isVerifried) {
                    const token = await jwt.sign({ 
                        _id: user._id,
                        
                     }, "mySecrete", { expiresIn: "1d" })
                    
                    const { password, ...info } = user._id;
                    return res.status(201).json({
						message: `Welcome back ${user.userName}`,
						data: { token, ...info },
					});
                } else {
                    const file = path.join(__dirname, "../views/index.ejs")

                    ejs.renderFile(file,(err,data)=>{
                        if(err){
                            console.log(err)
                        }else{
                            const mailOption = {
                                from:"my-Dev",
                                to:email,
                                subject:"Account verification",
                                html:data
                            }
                
                            transport.sendMail(mailOption,(err,info)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    console.log("mail sent",info.response)
                                }
                            })
                        }
                    })
                    return res.status(201).json({
                        status: "Success",
                        message: "check your email..."
                    })
                }
            } else {
                return res.status(500).json({
                    message:"Incorrect Password"
                })
            }
        } else {
            return res.status(500).json({
                message:"user email not found"
            })
        }
        // const userSignin = jwt.sign({

        // })
    } catch (err) {
        return res.status(500).json({
            message:err
        })
    }
}

export {createUser, getUsers, verifyUser}