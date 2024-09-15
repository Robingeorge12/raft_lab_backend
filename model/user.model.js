import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchemaCreator = new Schema({
  name: { type: String, trim: true, required: [true, "A user must have Name"] },
  email: {
    type: String,
    required: [true, "A user must have Email"],
    unique: true,
    trim: true,
  },
  
  role:{ type: String,enum:["admin"] ,default: "student"},
  password: {
    type: String,
    required: [true, "Enter Valid Password"],
    trim: true,
    },
    date: { type: Date,default: new Date() } 
});

const UserSchema = mongoose.model("user_list", userSchemaCreator);
 
export { UserSchema };