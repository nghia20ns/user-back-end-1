import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { Product } from "../models/ProductModel.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { Order } from "../models/OrderModel.js";
import mongoose from "mongoose";

export const showAccountService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTrans = await Order.find({ userId: id, status: 1 }).sort({
        createdAt: -1,
      });
      resolve({
        data: allTrans,
      });
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};

export const uploadProfileService = (file, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uniqueFileName = `${uuidv4()}.${file.originalname
        .split(".")
        .pop()}`;
      const updateAvt = await User.findByIdAndUpdate(id, {
        avatar: uniqueFileName,
      });
      fs.writeFile(`./upload/${uniqueFileName}`, file.buffer, (err) => {
        if (err || !updateAvt) {
          resolve({
            status: "error",
            message: "Error while uploading file",
          });
        } else {
          resolve({
            status: "success",
            data: updateAvt,
          });
        }
      });
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  });
};

export const changePasswordService = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      const hashPassword = bcrypt.hashSync(data.newPassword, 10);
      const checkPassword = bcrypt.compareSync(data.newPassword, user.password);
      const check = bcrypt.compareSync(data.oldPassword, user.password);
      if (!check) {
        resolve({
          status: "error",
          message: "old password not define",
        });
      } else {
        if (checkPassword) {
          resolve({
            status: "error",
            message: "Password must not be the same as the old password",
          });
        } else {
          const updateUser = await User.findByIdAndUpdate(id, {
            password: hashPassword,
          });
          if (updateUser) {
            resolve({
              status: "success",
              message: "update susses",
            });
          } else {
            resolve({
              status: "error",
              message: "the user not define",
            });
          }
        }
      }
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
export const getInformationService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findUser = await User.findById(id, { api_key: 0, role: 0 });
      if (findUser) {
        resolve({
          status: "success",
          data: findUser,
        });
      }
      resolve({
        status: "error",
        message: "user is not defined",
      });
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};

export const checkTokenService = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (!token) {
          resolve({
            status: "please login",
            message: "the token is invalid",
          });
        }
        if (err) {
          if (err.name === "JsonWebTokenError") {
            resolve({
              status: "please login",
              message: "the token has error",
            });
          }
          if (err.name === "TokenExpiredError") {
            resolve({
              status: "token expired",
              message: "the token has expired",
            });
          }
        } else if (user.role === 0 || user.role === 1 || user.role === 2) {
          resolve({
            status: "token valid",
            message: "token valid",
          });
        } else {
          resolve({
            status: "please login",
            message: "the user is not authorized",
          });
        }
      });
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
export const getAccountService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //find total quantity product status = 0 in db
      const hotmailNotSold = await Product.countDocuments({
        provider: "hotmail",
        status: 0,
      });
      const gmailNotSold = await Product.countDocuments({
        provider: "gmail",
        status: 0,
      });
      const hotmailSold = await Product.countDocuments({
        provider: "hotmail",
        status: 1,
      });
      const gmailSold = await Product.countDocuments({
        provider: "gmail",
        status: 1,
      });
      const totalHotmail = await Product.countDocuments({
        provider: "hotmail",
      });
      const totalGmail = await Product.countDocuments({ provider: "gmail" });

      resolve({
        totalHotmail: totalHotmail,
        totalGmail: totalGmail,
        hotmailNotSold: hotmailNotSold,
        gmailNotSold: gmailNotSold,
        hotmailSold: hotmailSold,
        gmailSold: gmailSold,
      });
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
