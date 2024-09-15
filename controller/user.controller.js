import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserSchema } from "../model/user.model.js";

export const signUp = async (req, res) => {
  console.log(req);

  try {
    const { name, email, password } = req.body;

    const isUser_signup = await UserSchema.findOne({ email: email });

    if (isUser_signup) {
      return res
        .status(422)
        .send({
          message: `${isUser_signup.name} is already signed up , Please login`,
        });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    const payload = {
      name,
      password: hashed_password,
      email,
    };

    console.log(payload);

    try {
      const add_signupdata = await UserSchema.create(payload);
      let result = add_signupdata.save();
      console.log(result);
      res.status(201).send({ message: "user signedup successfully" });
    } catch (er) {
      res.status(422).send({ message: "user signedup failed", er });
    }
  } catch (er) {
    console.log(er);
    res.status(422).send({ message: "user signedup failed", er });
  }
};

export const signIn = async (req, res) => {
  try {
    const payload = req.body;
    console.log("log", payload);

    const login_user = await UserSchema.findOne({ email: payload.email });
    console.log(login_user);

    if (!login_user) {
      return res.status(401).send({
        message: `This email and password are incorrect, if not signedup Please signup first`,
      });
    }

    let isUser_Exist = await bcrypt.compare(
      payload.password,
      login_user.password
    );

    if (isUser_Exist) {
      console.log("isEx", isUser_Exist);
      const token = await jwt.sign(
        { userId: login_user._id, email: login_user.email },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );
      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .send({ message: "User Signed in successfully", token, login_user });
    } else {
      console.log("isEx", isUser_Exist);
      return res.status(401).send({ message: "Email and password are wrong" });
    }
  } catch (er) {
    // console.log(er);
    return res.status(500).send({ message: "login error", er });
  }
};
