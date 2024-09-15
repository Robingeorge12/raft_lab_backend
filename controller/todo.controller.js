import axios from "axios";
import { Todo_Model } from "../model/todo.model.js";
import { UserSchema } from "../model/user.model.js";

// get_todo_List;
export const get_todo_List = async (req, res) => {

  try {
    let {
      limit,
      page,
      sortVal = "date",
      sortOrder = "all",
      searchVal,
      status,
    } = req.body;

    page = page && parseInt(page) > 0 ? parseInt(page) : 1;

    let set_limit = limit && parseInt(limit) > 0 ? parseInt(limit) : 5;

    let sortOption = {};

    if (sortOrder !== "all") {
      sortOption[sortVal] = sortOrder === "asc" ? 1 : -1;
    }

    const skip = (page - 1) * set_limit;

      let query = {};
          if (status) {
            query.todo_status = { $in: status.split(",") };
          }

    if (searchVal) {
      query.$or = [
        { title: { $regex: searchVal, $options: "i" } },
        { description: { $regex: searchVal, $options: "i" } },
      ];
    }

    const list_all_todos = await Todo_Model.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(set_limit);

    let total_Length = await Todo_Model.countDocuments(query);

    console.log("list all", list_all_todos);
    //   console.log(set_limit, "tlpg0", Math.ceil(total_Length / set_limit));
    return res.status(200).send({
      todos: list_all_todos,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total_Length / set_limit),
      total_Length,
    });
  } catch (er) {
    console.error("Error occurred:", er);
    return res.status(400).send({ message: "can't able to display todos" });
  }
};

export const add_todo = async (req, res) => {
  const { title, description, date, todo_status } = req.body;

  console.log("add", req.body);

  const { authorize_email } = req;
  const register_userId = await UserSchema.findOne({ email: authorize_email });

  if (!register_userId) {
    return res.status(400).send({ message: "Please Register " });
  }

  console.log(register_userId._id);
  const result = await Todo_Model.create({
    title,
    description,
    date: date || new Date(),
    todo_status: "Pending",
    writer_id: register_userId._id,
  });
  console.log(result);
  result.save();
  return res.status(200).send({ message: "Todo has been done" });
};

export const edit_todo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status_edit } = req.body;
    console.log("edit_id", id);
    // console.log(title, req.body);

    const todo_particular = await Todo_Model.findById(id);

    const isTrue_writer = await UserSchema.findOne({
      _id: todo_particular.writer_id,
    });

    if (!todo_particular) {
      return res.status(404).send({ message: "Todo not found" });
    }

    if (!isTrue_writer) {
      return res.status(404).send({ message: "User not found" });
    }
    const currentUserId = isTrue_writer._id;

    if (String(currentUserId) !== String(todo_particular.writer_id)) {
      return res
        .status(403)
        .send({ message: "Unauthorized to edit this todo" });
    }

    let updated_todo = {};
    if (title) {
      updated_todo.title = title;
    }

    if (description) {
      updated_todo.description = description;
    }

    if (status_edit) {
      updated_todo.todo_status = status_edit;
      }
      
      console.log("st", status_edit); 
      
    const result = await Todo_Model.findByIdAndUpdate(
      id,
      { $set: updated_todo },
      { new: true }
    );
    console.log("res",result)

    return res.status(200).send({
      message: "Todo updated successfully",
      updated_todo,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).send({ message: "Error updating todo", er });
  }
};

export const delete_todo_Byteacher = async (req, res) => {
  try {
    const { authorize_email } = req;

    const { id } = req.params;
    //   console.log(authorize_email);
    const isCheck = await UserSchema.findOne({ email: authorize_email });

    //   console.log(isCheck);

    if (isCheck.email !== "admin@gmail.com") {
      return res.status(400).send({ message: "Only Admin can delete todo" });
    }

    const del_Todo = await Todo_Model.deleteOne({ _id: id });
    res.status(200).send({ message: "Todo has been deleted" });
  } catch (er) {
    //   console.log(er);
    res.status(500).send({ message: "Server Side Error For delete todos" });
  }
};

export const filter_todo_Listr = async (req, res) => {

  try {
    const {
      page = 1,
      limit = 5,
      sortVal = "date",
      sortOrder = "asc",
      status,
      searchVal,
    } = req.body;
  
      console.log("filt_status",status)
        page = page && parseInt(page) > 0 ? parseInt(page) : 1;

        let set_limit = limit && parseInt(limit) > 0 ? parseInt(limit) : 5;

        let sortOption = {};

        if (sortOrder !== "all") {
          sortOption[sortVal] = sortOrder === "asc" ? 1 : -1;
        }

    // let set_limit = parseInt(limit);

    // let sortOption = {};

    // if (sortVal === "all") {
    //   sortOption = {};
    // } else if (sortVal === "date") {
    //   sortOption.createdAt = sortOrder === "asc" ? 1 : -1;
    // }

    const skip = (page - 1) * set_limit;

    let query = {};

    // Pending, Progress, Completed
     if (status) {
      
       query.todo_status = { $in: status.split(",") };
     }

    // Add search condition, if provided
    if (searchVal) {
      query.$or = [
        { title: { $regex: searchVal, $options: "i" } },
        { description: { $regex: searchVal, $options: "i" } },
      ];
    }
      console.log("fit", status);
       console.log("query", query);
      
    const filtered_todos = await Todo_Model.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(set_limit);

    console.log("res_fit", filtered_todos);


    const total_Length = await Todo_Model.countDocuments(query);

    return res.status(200).send({
      todos: filtered_todos,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total_Length / set_limit),
      total_Length,
    });
  } catch (error) {
    return res.status(400).send({ message: "Error filtering todos", error });
  }
};
