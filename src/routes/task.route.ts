import express from "express";
import { authMiddle } from "../middleware/auth.middleware";
import { create, Delete, getAll, update } from "../controller/task.controller";

const taskRouter = express.Router();

taskRouter.get("/getAll" , authMiddle , getAll);
taskRouter.post("/create" , authMiddle , create);
taskRouter.delete("/delete/:id" , authMiddle , Delete);
taskRouter.patch("/update/:id" , authMiddle , update);

export default taskRouter