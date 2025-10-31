const { validateEmail } = require("../utilities/regex");
const User = require("../models/user");
const Stats = require("../models/stats");
const Chat = require("../models/chat");
const bcrypt = require("bcryptjs");
const statsController = require('./statsController');
const chatController = require('./chatController');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, dateOfBirth, countryOfOrigin, preferredLanguage } =
      req.body;

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const emailFormCorrect = validateEmail(email);
    if (!emailFormCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Email form incorrect" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      countryOfOrigin,
      preferredLanguage
    });

    await newUser.save();

    const userForResponse = {
      username: newUser.username,
      email: newUser.email,
      dateOfBirth: newUser.dateOfBirth,
      countryOfOrigin: newUser.countryOfOrigin,
      preferredLanguage: newUser.preferredLanguage
    };

    await statsController.initializeStats(newUser.username);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userForResponse,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Error creating user", error: err });
  }
};

const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Both fields are required" });
    }

    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error logging in", error: err });
  }
};

const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: err,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching users", error: err });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { newUsername, email, dateOfBirth, countryOfOrigin, password } = req.body;

    let user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (newUsername == username) {
      return res
        .status(400)
        .json({ success: false, message: "Username already in use" });
    }

    if (newUsername) {
      const usernameExists = await User.findOne({ username: newUsername });
      if (usernameExists) {
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
      }
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      const emailFormCorrect = validateEmail(email);
      if (!emailFormCorrect) {
        return res
          .status(400)
          .json({ success: false, message: "Email form incorrect" });
      }
    }

    user.username = newUsername || user.username;
    user.email = email || user.email;
    user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth;
    user.countryOfOrigin = countryOfOrigin || user.countryOfOrigin;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;

    const updatedUser = await user.save();

    if (newUsername) {
      await Stats.findOneAndUpdate(
        { username: username }, 
        { $set: { username: newUsername } },
      );

      await Chat.updateMany(
        { username: username }, 
        { $set: { username: newUsername } },
      );
    }

    const userForResponse = {
      username: updatedUser.username,
      email: updatedUser.email,
      dateOfBirth: updatedUser.dateOfBirth,
      countryOfOrigin: updatedUser.countryOfOrigin,
      preferredLanguage: updatedUser.preferredLanguage
    };

    res.json({
      success: true,
      message: "User updated successfully",
      user: userForResponse,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error updating user", error: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOneAndDelete({ username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await statsController.deleteStats(username);
    await chatController.deleteChat(username);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting user", error: err });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
