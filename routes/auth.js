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
// Forgot password
router.post("/forgotPassword", authController.forgotPassword);
// Reset password
router.get("/reset/:token", authController.resetPassword);

module.exports = router;
