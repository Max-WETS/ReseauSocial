const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const userController = require("../controllers/userController");

// get users
router.get("/", userController.getUsers);
// get user
router.get("/:id", userController.getUser);
// update user
router.put("/:id", userController.updateUser);
// delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
