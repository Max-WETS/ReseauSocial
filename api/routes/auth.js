const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authController = require("../controllers/authController");

// Register
router.post("/register", authController.register);
// Login
router.post("/login", authController.login);
// Logout
router.get("/logout", authController.logout);

module.exports = router;
