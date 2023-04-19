import mongoose from 'mongoose';

type userData = {
    userName: string,
    email: string,
    password: string,
    isVerifried: boolean,
    verified:string,
}

interface userRecords extends userData, mongoose.Document {}

const userModel = new mongoose.Schema({
    userName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    isVerifried: {
        type: Boolean
    },
    verified: {
        type: String
    }
})

export default mongoose.model<userRecords>("users", userModel)