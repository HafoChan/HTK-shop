import userModel from "../models/users.js";
import bcrypt from "bcryptjs";

class User {
  async getAllUser(req, res) {
    try {
      let users = await userModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });

      return res.json({ users });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSingleUser(req, res) {
    let { id } = req.params;

    try {
      let user = await userModel
        .findById(id)
        .select("name email phoneNumber userImage updatedAt createdAt");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async putEditUser(req, res) {
    let { id } = req.params;
    let { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    try {
      let user = await userModel.findByIdAndUpdate(
        id,
        {
          name: name,
          phoneNumber: phoneNumber,
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ success: "User updated successfully", user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteUser(req, res) {
    let { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User id is required" });
    }

    try {
      let user = await userModel.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ success: "User deleted successfully", user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async changePassword(req, res) {
    let { id } = req.params;
    let { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Your old password is wrong!" });
      }

      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();

      return res.json({ success: "Password updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const userController = new User();
export default userController;
