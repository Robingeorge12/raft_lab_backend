import express from "express";
import { Router } from "express";
import { signIn, signUp } from "../controller/user.controller.js";



const userRoute = Router();

userRoute.post("/singnup_user", signUp);
userRoute.post("/login", signIn)

export default userRoute;


