import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  
    const token = req.headers.authorization;
    console.log("token",token)
    

    if (!token) {
      
    return res
      .status(400)
      .send({ message: "Unauthorized , token is not provided" });
  }

  try {
    try {
      const decode = await jwt.verify(token, process.env.SECRET_KEY);
      console.log("decod", decode);
      if (!decode.email && !decode.userId) {
        return res.status(400).send({ message: "You are not authenticated" });
      }

      req.authorize_email = decode.email;

      //   console.log("decod", req.authorize_email)
      next();
    } catch (er) {
      //   console.log(er);
 
      res.status(400).send({ message: "Authentication failed", er });
    }
  } catch (er) {
    console.log(er);
    res
      .status(500)
      .send({ message: "Authentication Error From Server Side", er });
  }
};


