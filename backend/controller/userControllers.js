const express = require("express");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password, userTasks } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exists.");
    } else {
      const newUser = await User({
        name,
        email,
        password,
      });
      await newUser.save();

      const newTask = await Task({
        email,
        tasks: [],
      });
      await newTask.save();

      const userTasks_ = await Task.findOne({ email });
      userTasks_.tasks = userTasks.map((obj) => {
        const userTask = {
          task: obj.task,
          categoryType: obj.categoryType,
          isCompleted: obj.isCompleted,
          isTask: obj.isTask,
          isShow: obj.isShow,
        };
        return userTask;
      });
      await userTasks_.save();
      return res.status(201).send("Account created successfully.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateAuthToken();
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 2629800000),
          httpOnly: true,
        });
        return res.status(201).send("Login successfully.");
      } else {
        return res.status(400).send("The passwords do not match.");
      }
    } else {
      return res.status(400).send("Invalid email address.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const userProfile = asyncHandler(async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(error);
  }
});

const addTask = asyncHandler(async (req, res) => {
  const { email, task, categoryType } = req.body;
  try {
    const user = await Task.findOne({ email });
    if (user) {
      const userTask = {
        task,
        categoryType: categoryType.substring(1),
        isCompleted: categoryType.charAt(0) === "0",
        isTask: categoryType.charAt(0) === "1",
      };
      user.tasks.unshift(userTask);
      await user.save();
      return res.status(201).send("Task added successfully.");
    } else {
      return res.status(400).send("Unable to add task.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const userTasks = asyncHandler(async (req, res) => {
  try {
    const user = await Task.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send("Unable to find tasks.");
    } else {
      res.send(user.tasks);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const deleteUserTask = asyncHandler(async (req, res) => {
  const { email, id } = req.body;
  try {
    const user = await Task.findOne({ email });
    if (user) {
      user.tasks = user.tasks.filter((obj) => obj._id.toString() !== id);
      await user.save();
      return res.status(201).send("Task deleted successfully.");
    } else {
      return res.status(400).send("Unable to delete task.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const completeUserTask = asyncHandler(async (req, res) => {
  const { email, id } = req.body;
  try {
    const user = await Task.findOne({ email });
    if (user) {
      user.tasks = user.tasks.map((obj) => {
        if (obj._id.toString() === id) return { ...obj, isCompleted: true };
        return obj;
      });
      await user.save();
      return res.status(201).send("Task completed successfully.");
    } else {
      return res.status(400).send("Unable to complete task.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.send("Logout successfully.");
});

const showUserTask = asyncHandler(async (req, res) => {
  const { email, id } = req.body;

  try {
    const user = await Task.findOne({ email });
    if (user) {
      user.tasks = user.tasks.map((obj) => {
        if (obj._id.toString() === id) return { ...obj, isShow: false };
        return obj;
      });
      await user.save();
      return res.status(201).send("Task Hide successfully.");
    } else {
      return res.status(400).send("Unable to Hide task.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const updateUserTask = asyncHandler(async (req, res) => {
  const { email, task, id } = req.body;
  try {
    const user = await Task.findOne({ email });
    if (user) {
      user.tasks = user.tasks.map((obj) => {
        if (obj._id.toString() === id) return { ...obj, task };
        return obj;
      });
      await user.save();
      return res.status(201).send("Task updated successfully.");
    } else {
      return res.status(400).send("Unable to update task.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const updateUserName = asyncHandler(async (req, res) => {
  const { email, newName } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.name = newName;
      await user.save();
      return res.status(201).send("Name updated successfully.");
    } else {
      return res.status(400).send("Unable to update name.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const updateUserEmail = asyncHandler(async (req, res) => {
  const { email, newEmail } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.email = newEmail;
      await user.save();
      const userTasks = await Task.findOne({ email });
      if (userTasks) {
        userTasks.email = newEmail;
        await userTasks.save();
      }
      return res.status(201).send("Email updated successfully.");
    } else {
      return res.status(400).send("Unable to update email.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.password = password;
      await user.save();
      return res.status(201).send("Password updated successfully.");
    } else {
      return res.status(400).send("Unable to update password.");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

const verifyUserTask = asyncHandler(async (req, res) => {
  const { email, secretKey, id } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(secretKey, user.password);
      if (isMatch) {
        const userTasks = await Task.findOne({ email });
        userTasks.tasks = userTasks.tasks.map((obj) => {
          if (obj._id.toString() === id) return { ...obj, isShow: true };
          return obj;
        });
        await userTasks.save();
        return res.status(201).send("Task verify successfully.");
      } else {
        return res.status(400).send("Password do not match.");
      }
    } else {
      return res.status(400).send("User does not exist.");
    }
  } catch (error) {
    return res.status(500).send(error);
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
  verifyUserTask,
};
