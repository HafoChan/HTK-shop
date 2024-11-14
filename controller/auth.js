import { toTitleCase, validateEmail } from "../config/function.js";
import bcrypt from "bcryptjs";
import userModel from "../models/users.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/keys.js";

class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      if (!loggedInUserRole) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async postSignup(req, res) {
    let { name, email, password, cPassword } = req.body;

    if (!name || !email || !password || !cPassword) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    if (name.length < 3 || name.length > 25) {
      return res.status(400).json({ error: "Name must be 3-25 characters" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    if (password.length < 8 || password.length > 255) {
      return res
        .status(400)
        .json({ error: "Password must be 8-255 characters" });
    }

    try {
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      let newUser = new userModel({
        name: toTitleCase(name),
        email,
        password: hashedPassword,
        userRole: 1, // Default role for admin
      });

      await newUser.save();

      res
        .status(201)
        .json({ success: "Account created successfully. Please login" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async postSignin(req, res) {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Fields must not be empty" });
    }

    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { _id: user._id, role: user.userRole },
        JWT_SECRET
      );

      res.json({ token, user: { _id: user._id, role: user.userRole } });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const authController = new Auth();
export default authController;
