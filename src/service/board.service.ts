import mongoose from "mongoose";
import { errMSG, MSG } from "../constant/message";
import { statuscode } from "../constant/statusCode";
import { IBoardDto } from "../dto/IBoardDto";
import Board from "../model/board.model";
import { ApiError } from "../utility/apiError";

export class BoardService {
    async createBoard(boardData: IBoardDto) {
        const createdBoard = await Board.create({
            title: boardData.title,
            userId: boardData.userId,
            tasks: boardData.tasks ?? []
        })

        return {
            statuscode: statuscode.created,
            content: {
                message: MSG.success("Board is created"),
                data: createdBoard
            }
        }
    }

    async getAllBoard() {

        const getAllBoards = await Board.aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: "tasks",
                    localField: "tasksID",
                    foreignField: "_id",
                    as: "tasks",
                },
            },
           
        ]);

        return {
            statuscode: statuscode.created,
            content: {
                message: MSG.success("All Boards is get"),
                data: getAllBoards
            }
        }
    }

    async getBoardById(id: string) {

        const getBoard = await Board.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "tasks",
                    localField: "tasksID",
                    foreignField: "_id",
                    as: "tasks",
                },
            },
           
        ]);

        return {
            statuscode: statuscode.created,
            content: {
                message: MSG.success("Board is get"),
                data: getBoard
            }
        }
    }

    async updateBoard(updateBoardData: any, id: string) {
        console.log(updateBoardData);
        
        const result = await Board.findByIdAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(id),
            },
            {
                $set: {
                   ...updateBoardData
                },
            },
            { new: true }
        );
        console.log(result);

        if (result) {
            return {
                statuscode: statuscode.ok,
                content: {
                    message: MSG.success("Board Is updated"),
                    data: result
                },
            };
        }
        throw new ApiError(statuscode.NotImplemented, errMSG.defaultErrorMsg);
    }

    async deleteBoard(id: string) {

        const deltedBoard = await Board.findByIdAndDelete(new mongoose.Types.ObjectId(id))
        if (deltedBoard) {
            return {
                statuscode: statuscode.ok,
                content: {
                    message: MSG.success("Board is deleted"),
                }
            }
        }
        throw new ApiError(statuscode.NotImplemented, errMSG.defaultErrorMsg);
    }
}