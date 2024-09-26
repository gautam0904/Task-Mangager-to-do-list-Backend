import mongoose from "mongoose";
import { errMSG } from "../constant/message";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true , errMSG.required("Task Title")],
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['to-do', 'in-progress', 'done'],
        default: 'to-do',
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    order: {
        type: Number, 
        default: 0,
    },
},{timestamps : true});

const Task = mongoose.model("Task" , taskSchema)

export default Task