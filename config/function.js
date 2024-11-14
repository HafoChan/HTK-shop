/* This all of are helper function */
import userModel from "../models/users.js";

export const toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const validateEmail = function (mail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
};

export const emailCheckInDatabase = async function (email) {
  let user = await userModel.findOne({ email: email });
  return user !== null; // Trả về true nếu tìm thấy, false nếu không
};

export const phoneNumberCheckInDatabase = async function (phoneNumber) {
  let user = await userModel.findOne({ phoneNumber: phoneNumber });
  return user !== null; // Trả về true nếu tìm thấy, false nếu không
};
