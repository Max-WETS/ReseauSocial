const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomBytes = require("randombytes");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// register
module.exports.register = async (req, res) => {
  try {
    console.log(req.body);
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save user
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// login
module.exports.login = async (req, res) => {
  try {
    // check user
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    // check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    // create session cookie
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(500).json(err);
  }
};

// logout
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).send("logged out");
};

// forgot password
module.exports.forgotPassword = async (req, res) => {
  if (req.body.email === "") {
    res.status(400).send("email required");
  }
  console.error(req.body.email);

  const token = randomBytes(20).toString("hex");
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
    }
  );
  !user && res.status(200).send("email not found in MongoDB");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "maxweb910@gmail.com",
    to: `${user.email}`,
    subject: "Link to Reset Password",
    text:
      "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
      `http://localhost:3000/reset/${token}\n\n`,
  };

  console.log("sending mail");

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error("there was an error: ", err);
    } else {
      console.log("here is the res: ", response);
      res.status(200).json("recovery email sent");
    }
  });
};

// reset password
module.exports.resetPassword = async (req, res) => {
  const query = User.find();
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec();
  console.log("user: ", user);
  console.log("test user: ", !user);
  if (!user) {
    res.status(200).send({ message: "no user found or link expired" });
  } else {
    res.status(200).send({
      userId: user._id,
      username: user.username,
      message: "password reset link ok",
    });
  }
};
