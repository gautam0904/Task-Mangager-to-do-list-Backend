import express from "express";
import { authMiddle } from "../middleware/auth.middleware";
import { create, Delete, getAll, update,get } from "../controller/board.controller";

const boardRouter = express.Router();

boardRouter.get("/getAll" , authMiddle , getAll);
boardRouter.get("/get/:id" , authMiddle , get);
boardRouter.post("/create" , authMiddle , create);
boardRouter.delete("/delete/:id" , authMiddle , Delete);
boardRouter.patch("/update/:id" , authMiddle , update);

export default boardRouter