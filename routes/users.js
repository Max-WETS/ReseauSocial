const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer();
const userController = require("../controllers/userController");
const uploadController = require("../controllers/uploadController");

// get users
router.get("/", userController.getUsers);
// get user
router.get("/:id", userController.getUser);
// update user
router.put("/:id", userController.updateUser);
// delete user
router.put("/:id/delete", userController.deleteUser);

// upload
router.post("/upload", upload.single("file"), uploadController.uploadPicture);

module.exports = router;
