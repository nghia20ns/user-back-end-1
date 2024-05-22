import {
  getInformationService,
  checkTokenService,
  getAccountService,
  changePasswordService,
  uploadProfileService,
  showAccountService,
} from "../services/ClientService.js";
import mime from "mime-types";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import imageSize from "image-size"; // Module này giúp lấy kích thước hình ảnh

export const showAccountController = async (req, res) => {
  try {
    const id = req.user._id;
    const response = await showAccountService(id);
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.json({
        status: "err",
        message: "server is problem",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};

//upload file

export const uploadProfileController = async (req, res) => {
  try {
    const id = req.user._id;
    if (!id) {
      return res.json({
        status: "error",
        message: "ID not valid",
      });
    }
    if (!req.file) {
      return res.json({
        status: "error",
        message: "No image upload",
      });
    }

    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = path
      .extname(req.file.originalname)
      .toLowerCase()
      .substring(1);
    if (!allowedExtensions.includes(fileExtension)) {
      return res.json({
        status: "error",
        message: "Only allow file image",
      });
    }

    const mimeType = mime.lookup(req.file.originalname);
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.json({
        status: "error",
        message: "Type file not valid",
      });
    }

    const fileSizeLimit = 2048 * 1024; // 2M
    if (req.file.size > fileSizeLimit) {
      return res.json({
        status: "error",
        message: "File very big",
      });
    }

    // Kiểm tra nội dung tệp bằng cách xác minh kích thước hình ảnh
    let dimensions;
    try {
      dimensions = imageSize(req.file.buffer);
    } catch (error) {
      return res.json({
        status: "error",
        message: "Content file not valid!",
      });
    }
    if (!dimensions) {
      return res.json({
        status: "error",
        message: "Content file not valid!",
      });
    }

    const result = await uploadProfileService(req.file, id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const data = req.body;
    const id = req.user._id;
    if (id) {
      const response = await changePasswordService(id, data);
      if (response) {
        return res.json(response);
      } else {
        return res.json({
          status: "err",
          message: "server is problem",
        });
      }
    } else {
      return res.json({
        status: "err",
        message: "id is not valid",
      });
    }
  } catch (error) {
    return res.json({
      status: "err",
      message: error,
    });
  }
};

export const getInformationController = async (req, res) => {
  try {
    const id = req.user._id;
    const response = await getInformationService(id);
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.json({
        status: "error",
        message: "server is problem",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

export const checkTokenController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({
        status: "please login",
        message: "Authorization header missing",
      });
    }
    const token = authHeader.split(" ")[1];
    const response = await checkTokenService(token);
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.json({
        status: "err",
        message: "server is problem",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};

export const getAccountController = async (req, res) => {
  try {
    const response = await getAccountService();
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.json({
        status: "err",
        message: "server is problem",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};
