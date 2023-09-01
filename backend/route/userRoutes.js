const express = require("express");
const router = express.Router();
const {
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
} = require("../controller/userControllers");
const verifyUser = require("../middleware/verifyUser");

router.route("/signup").post(userRegister);
router.route("/login").post(userLogin);
router.route("/profile").get(verifyUser, userProfile);
router.route("/add-task").post(addTask);
router.route("/user-tasks").get(verifyUser, userTasks);
router.route("/delete-task").post(deleteUserTask);
router.route("/complete-task").post(completeUserTask);
router.route("/logout").get(userLogout);
router.route("/show-task").post(showUserTask);
router.route("/update-task").post(updateUserTask);
router.route("/update-name").post(updateUserName);
router.route("/update-email").post(updateUserEmail);
router.route("/update-password").post(updateUserPassword);
router.route("/verify-user-task").post(verifyUserTask);

module.exports = router;
