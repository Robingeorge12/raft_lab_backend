import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import { connection } from "./db/db.js";
import userRoute from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js";

// authenticate.js;
// authoriztion.js

const app = express()
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 6450




app.use("/signup", userRoute);
app.use("/todo", todoRouter);


app.listen(PORT, async() => {
    // console.log( PORT)
    try {

        await connection;
           console.log(PORT);
    
    } catch (er) {
        
        console.log(er)
}

})