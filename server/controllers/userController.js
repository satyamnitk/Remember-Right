const express = require("express");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please complete the field properly." });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists." });
    } else {
      const newUser = await User({
        name,
        email,
        password,
      });
      const result = await newUser.save();
      if (result) {
        return res
          .status(201)
          .json({ message: "Account created successfully." });
      } else {
        return res.status(400).json({ error: "Unable to create account." });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please complete the field properly." });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateAuthToken();
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 2592000000),
          httpOnly: true,
        });
        return res.status(201).json({ message: "Login successfully." });
      } else {
        return res.status(400).json({ message: "The passwords do not match." });
      }
    } else {
      return res.status(400).json({ error: "Invalid email address." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const userProfile = asyncHandler(async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(`Error in getting profile ${error}`);
  }
});

const addTask = asyncHandler(async (req, res) => {
  const { email, task, categoryType } = req.body;
  if (!task) {
    return res
      .status(400)
      .json({ error: "Please complete the field properly." });
  }
  try {
    const userTask = await Task.findOne({ email });
    if (!userTask) {
      const newTask = await Task({
        email,
        tasks: [
          {
            task,
            categoryType: categoryType.substring(1),
            isCompleted: categoryType.charAt(0) === "0",
            isTask: categoryType.charAt(0) === "1",
          },
        ],
      });
      const result = await newTask.save();
      if (result) {
        return res.status(201).json({ message: "Task added successfully." });
      } else {
        return res.status(400).json({ error: "Unable to add task." });
      }
    } else {
      try {
        userTask.tasks.unshift({
          task,
          categoryType: categoryType.substring(1),
          isCompleted: categoryType.charAt(0) === "0",
          isTask: categoryType.charAt(0) === "1",
        });
        await userTask.save();
        return res.status(201).json({ message: "Task added successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const userTasks = asyncHandler(async (req, res) => {
  try {
    const userTasks = await Task.findOne({ email: req.user.email });
    if (!userTasks) {
      return res.status(404).json({ error: "Unable to find tasks." });
    } else {
      res.send(userTasks.tasks);
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const deleteUserTask = asyncHandler(async (req, res) => {
  const { email, id } = req.body;
  try {
    const userTasks = await Task.findOne({ email });
    if (userTasks) {
      try {
        const index = userTasks.tasks.findIndex(
          (obj) => obj._id.toString() === id
        );
        if (index === -1) {
          return res.status(400).json({ error: "Unable to delete task." });
        }
        userTasks.tasks.splice(index, 1);
        await userTasks.save();
        return res.status(201).json({ message: "Task deleted successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } else {
      return res.status(400).json({ error: "Unable to delete task." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const completeUserTask = asyncHandler(async (req, res) => {
  const { email, id } = req.body;
  try {
    const userTasks = await Task.findOne({ email });
    if (userTasks) {
      try {
        const index = userTasks.tasks.findIndex(
          (obj) => obj._id.toString() === id
        );
        if (index === -1) {
          return res.status(400).json({ error: "Unable to complete task." });
        }
        userTasks.tasks[index].isCompleted = true;
        await userTasks.save();
        return res
          .status(201)
          .json({ message: "Task completed successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } else {
      return res.status(400).json({ error: "Unable to complete task." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.send("Logout successfully.");
});

const showUserTask = asyncHandler(async (req, res) => {
  const { email, id } = req.body;
  try {
    const userTasks = await Task.findOne({ email });
    if (userTasks) {
      try {
        const index = userTasks.tasks.findIndex(
          (obj) => obj._id.toString() === id
        );
        if (index === -1) {
          return res.status(400).json({ error: "Unable to Show / Hide task." });
        }
        userTasks.tasks[index].isShow = !userTasks.tasks[index].isShow;
        await userTasks.save();
        return res
          .status(201)
          .json({ message: "Task Show / Hide successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } else {
      return res.status(400).json({ error: "Unable to Show / Hide task." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const updateUserTask = asyncHandler(async (req, res) => {
  const { email, task, id } = req.body;
  try {
    const userTasks = await Task.findOne({ email });
    if (userTasks) {
      try {
        const index = userTasks.tasks.findIndex(
          (obj) => obj._id.toString() === id
        );
        if (index === -1) {
          return res.status(400).json({ error: "Unable to update task." });
        }
        userTasks.tasks[index].task = task;
        await userTasks.save();
        return res.status(201).json({ message: "Task updated successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } else {
      return res.status(400).json({ error: "Unable to update task." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const updateUserName = asyncHandler(async (req, res) => {
  const { email, newName } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      try {
        user.name = newName;
        await user.save();
        return res.status(201).json({ message: "Name updated successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } else {
      return res.status(400).json({ error: "Unable to update name." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const updateUserEmail = asyncHandler(async (req, res) => {
  const { email, newEmail } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      try {
        user.email = newEmail;
        await user.save();
        const userTask = await Task.findOne({ email });
        if (userTask) {
          userTask.email = newEmail;
          await userTask.save();
        }
        return res.status(201).json({ message: "Email updated successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } else {
      return res.status(400).json({ error: "Unable to update email." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      try {
        user.password = password;
        await user.save();
        return res
          .status(201)
          .json({ message: "Password updated successfully." });
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } else {
      return res.status(400).json({ error: "Unable to update password." });
    }
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
});

module.exports = {
  userRegister,
  userLogin,
  userProfile,
  addTask,
  userTasks,
  deleteUserTask,
  completeUserTask,
  userLogout,
  showUserTask,
  updateUserTask,
  updateUserName,
  updateUserEmail,
  updateUserPassword,
};
