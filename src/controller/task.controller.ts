import { Request , Response } from "express";
import { statuscode } from "../constant/statusCode";
import { ApiError } from "../utility/apiError";
import { errMSG } from "../constant/message";
import { TaskService } from "../service/task.service";
import { ITaskDto } from "../dto/ITaskDto";
import { taskSchema } from "../interface/yupValidatorSchemas";

const taskService = new TaskService()

export const create = async (req : Request , res : Response) =>{
    try {
        const reqBody = req.body;
        const taskData : ITaskDto = await taskSchema.validate(reqBody);

        const createdTask = await taskService.createTask(taskData);

        res.status(createdTask.statuscode).json(createdTask.content);
    } catch (error) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}
export const  update = async (req : Request , res : Response) =>{
    try {
        const updateData  = req.body;
        const id = req.params.id;

        const updatedTask = await taskService.updateTask(updateData ,id);
        res.status(updatedTask.statuscode).json(updatedTask.content);
    } catch (error) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}
export const  getAll = async (req : Request , res : Response) =>{
    try {
        const tasks = await taskService.getAllTask();
        res.status(tasks.statuscode).json(tasks.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}
export const Delete = async (req : Request , res : Response) =>{
    try {
        const id = req.params.id;

        const deletedTask = await taskService.deleteTask(id);
        res.status(deletedTask.statuscode).json(deletedTask.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}