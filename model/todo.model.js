import mongoose, { Schema } from "mongoose";

const createTodo = new Schema({
  writer_id: { type: mongoose.Schema.ObjectId, trim: true, ref: "UserSchema" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  todo_status: {
    type: String,
    enum: ["Pending", "Progress", "Completed"],
    default: "Pending",
  },
  date: { type: Date, default: new Date() },
});

const Todo_Model = mongoose.model("todo_list", createTodo);

export { Todo_Model }; 