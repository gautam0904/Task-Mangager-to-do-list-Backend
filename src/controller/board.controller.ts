import { Request , Response } from "express";
import { BoardService } from "../service/board.service";
import { statuscode } from "../constant/statusCode";
import { ApiError } from "../utility/apiError";
import { errMSG } from "../constant/message";

const boardService = new BoardService()

export const create = async (req : Request , res : Response) =>{
    try {
        const boardData = req.body;

        if(!boardData.title){
            throw new ApiError(statuscode.NotAcceptable , errMSG.required("Board Title"))
        }

        boardData.userId = req.body.USERID;

        const createdBoard = await boardService.createBoard(boardData);

        res.status(createdBoard.statuscode).json(createdBoard.content);
    } catch (error) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}
export const  update = async (req : Request , res : Response) =>{
    try {
        const updateData  = req.body;
        const id = req.params.id;

        const updatedBoard = await boardService.updateBoard(updateData ,id);
        res.status(updatedBoard.statuscode).json(updatedBoard.content);
    } catch (error) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}
export const  getAll = async (req : Request , res : Response) =>{
    try {
        const boards = await boardService.getAllBoard();
        res.status(boards.statuscode).json(boards.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}

export const  get = async (req : Request , res : Response) =>{
    try {
	const id = req.params.id;
        const boards = await boardService.getBoardById(id);
        res.status(boards.statuscode).json(boards.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}

export const Delete = async (req : Request , res : Response) =>{
    try {
        const id = req.params.id;

        const deletedBoard = await boardService.deleteBoard(id);
        res.status(deletedBoard.statuscode).json(deletedBoard.content);
    } catch (error : any) {
        res.status(error.statuscode || statuscode.NotImplemented).json({message : error.message});
    }
}