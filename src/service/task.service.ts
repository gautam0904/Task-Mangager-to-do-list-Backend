import mongoose from "mongoose";
import { errMSG, MSG } from "../constant/message";
import { statuscode } from "../constant/statusCode";
import { ApiError } from "../utility/apiError";
import Task from "../model/task.model";
import { ITaskDto } from "../dto/ITaskDto";

export class TaskService {
    async createTask(taskData: ITaskDto) {

        const createdTask = await Task.create({
            title: taskData.title,
            description : taskData.description,
            status : taskData.status,
            boardId : taskData.boardId,
            order : taskData.order
        });

        return {
            statuscode: statuscode.created,
            content: {
                message: MSG.success("Task is created"),
                data: createdTask
            }
        }
    }

    async getAllTask() {

        const getAllTasks = await Task.find();

        return {
            statuscode: statuscode.created,
            content: {
                message: MSG.success("All Tasks is get"),
                data: getAllTasks
            }
        }
    }

    async updateTask(updateTaskData: ITaskDto, id: string) {

        const result = await Task.findByIdAndUpdate(
            {
                _id: new mongoose.Schema.Types.ObjectId(id),
            },
            {
                $set: {
                    updateTaskData
                },
            },
            { new: true }
        );
        if (result) {
            return {
                statuscode: statuscode.ok,
                content: {
                    message: MSG.success("Task Is updated"),
                    data: result
                },
            };
        }
        throw new ApiError(statuscode.NotImplemented, errMSG.defaultErrorMsg);
    }

    async deleteTask(id: string) {

        const deltedTask = await Task.findByIdAndDelete(new mongoose.Schema.Types.ObjectId(id))
        if (!deltedTask) {
            throw new ApiError(statuscode.NotImplemented, errMSG.defaultErrorMsg);
        }
        return {
            statuscode: statuscode.ok,
            content: {
                message: MSG.success("Task is deleted"),
            }
        }
    }
}