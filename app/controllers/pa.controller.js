const Pa = require("../models/pa.model");
const axios = require("axios");
const { generateJWTToken } = require("../utility/jwt.token.auth"); 
var log4js = require("../config/logger");
var logger = log4js.getLogger();

const jwtSecretKey = process.env.JWT_SECRETE;

// Test API.
exports.test = async (req, res) => {
  console.log("Inside Test COntroller...")
  try {
    logger.log("Inside Test Function");
    const typesResponse = await Pa.testModel(req);
    res.send(typesResponse);
  } catch (err) {
    logger.log("Error: ", err);
    return res.status(500).send({
      status: 500,
      message: err.message || "Error! Internal Server Error.",
    });
  }
};

// Search NASA Image API.
exports.SearchNasaImageController = async (req, res) => {
  console.log(req.body);
  try {
    logger.log("Inside SearchNasaImageController."); 
    const typesResponse = await Pa.SearchNasaImage(req.body);
    res.json(typesResponse);
  } catch (err) {
    logger.log("Error: ", err);
    return res.status(500).send({
      status: 500,
      message: err.message || "Error! Internal Server Error.",
    });
  }
};

exports.LoginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.log("Inside LoginController.");
    if (Object.keys(req.body).length === 0 || !username || !password) {
      return res.status(400).send({
        status: 400,
        message: "Invalid request body.",
      });
    }
    const data = await Pa.getLoginModel(req.body);
    if (data.status == 401) {
      return res.status(401).send(data);
    }
    // deleting password from response
    delete data.user.password;
    const token = generateJWTToken(data.user, jwtSecretKey, {
      expiresIn: "2h",
    });
    data.user.accessToken = token;
    return res.status(200).send(data);
  } catch (err) {
    logger.log("Error: ", err);
    return res.status(500).send({
      status: 500,
      message: "Error! Internal Server Error.",
    });
  }
};


