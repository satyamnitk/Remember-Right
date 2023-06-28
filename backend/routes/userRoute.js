const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyUser = require("../middleware/verifyUser");

router.route("/signup").post(userController.userRegister);
router.route("/login").post(userController.userLogin);
router.route("/profile").get(verifyUser, userController.userProfile);
router.route("/add-task").post(userController.addTask);
router.route("/user-tasks").get(verifyUser, userController.userTasks);
router.route("/delete-task").post(userController.deleteUserTask);
router.route("/complete-task").post(userController.completeUserTask);
router.route("/logout").get(userController.userLogout);

module.exports = router;
