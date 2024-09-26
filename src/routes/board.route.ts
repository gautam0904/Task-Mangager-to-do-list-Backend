import express from "express";
import { authMiddle } from "../middleware/auth.middleware";
import { create, Delete, getAll, update } from "../controller/board.controller";

const boardRouter = express.Router();

boardRouter.get("/getAll" , authMiddle , getAll);
boardRouter.post("/create" , authMiddle , create);
boardRouter.delete("/delete/:id" , authMiddle , Delete);
boardRouter.patch("/update/:id" , authMiddle , update);

export default boardRouter