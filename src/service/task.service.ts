import mongoose from "mongoose";
import { errMSG, MSG } from "../constant/message";
import { statuscode } from "../constant/statusCode";
import { ApiError } from "../utility/apiError";
import Task from "../model/task.model";
import { ITaskDto } from "../dto/ITaskDto";
import { BoardService } from "./board.service";
import { IBoardDto } from "../dto/IBoardDto";

export class TaskService {
    boardService = new BoardService();
    async createTask(taskData: ITaskDto) {

        const boardResponse = await this.boardService.getBoardById(taskData.boardId);
        const board : any= boardResponse.content.data;

        const createdTask = await Task.create({
            title: taskData.title,
            description : taskData.description,
            boardId : taskData.boardId,
        });
        
        board[0].tasksID.push(new mongoose.Types.ObjectId(createdTask._id));
    
        const updatedBoard = await this.boardService.updateBoard(board[0] , board[0]._id)

        return {
            statuscode: statuscode.created,
            content: {
                message: MSG.success("Task is created"),
                data: createdTask,updatedBoard
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
                _id: new mongoose.Types.ObjectId(id),
            },
            {
                $set: {
                    ...updateTaskData
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

        const deltedTask = await Task.findByIdAndDelete(new mongoose.Types.ObjectId(id))
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