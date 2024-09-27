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
  {
    $unwind: {
      path: "$tasks",
      preserveNullAndEmptyArrays: true,
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

    async getBoardById(id : string) {

        const getBoard = await Board.aggregate([
  {$match :{_id : new mongoose.Schema.Types.ObjectId(id)}},
  {
    $lookup: {
      from: "tasks",
      localField: "tasksID",
      foreignField: "_id",
      as: "tasks",
    },
  },
  {
    $unwind: {
      path: "$tasks",
      preserveNullAndEmptyArrays: true,
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

    async updateBoard(updateBoardData: IBoardDto , id: string) {

        const result = await Board.findByIdAndUpdate(
            {
                _id: new mongoose.Schema.Types.ObjectId(id),
            },
            {
                $set: {
                    updateBoardData
                },
            },
            { new: true }
        );
        if (result) {
            return {
                statuscode: statuscode.ok,
                content: {
                    message : MSG.success("Board Is updated"),
                    data : result
                },
            };
        }
        throw new ApiError(statuscode.NotImplemented, errMSG.defaultErrorMsg);
    }

    async deleteBoard(id : string) {

        const deltedBoard = await Board.findByIdAndDelete(new mongoose.Schema.Types.ObjectId(id))
        if(deltedBoard){
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