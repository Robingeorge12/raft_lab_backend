import express from "express";
import { Router } from "express";
import { add_todo, delete_todo_Byteacher, edit_todo,  get_todo_List } from "../controller/todo.controller.js";
import { isAuth } from "../middleware/authenticate.js";
import { isAdmin } from "../middleware/authoriztion.js";

const todoRouter = Router();

todoRouter.get("/", get_todo_List);
todoRouter.post("/add_todos", isAuth, add_todo);
todoRouter.patch("/edit/:id", isAuth, edit_todo);
todoRouter.delete("/delete/:id", isAuth, isAdmin, delete_todo_Byteacher);



export default todoRouter;
