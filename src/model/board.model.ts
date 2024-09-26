import mongoose from "mongoose";
import { errMSG } from "../constant/message";

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true ,errMSG.required("Board Title")],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: [true ,errMSG.required("Board User")],
    },
    tasksID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', 
    }],
},{timestamps : true});

const Board = mongoose.model("Board" , boardSchema)

export default Board