const Pa = require("../models/pa.model");
const axios = require("axios"); 
const { generateJWTToken } = require("../utility/jwt.token.auth");
const {
  validateEmail,
  hashPassword,
  comparePasswords,
} = require("../utility/helper"); 
var log4js = require("../config/logger");
var logger = log4js.getLogger();

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

// Search NASA Image..
exports.SearchNasaImage = async (req, res) => {
  console.log(req.body);
  try {
    logger.log("Inside SearchNasaImage Function");
    const { title, yearStartDate, yearEndDate, mediaType } = req.body;
    if (!title || !yearStartDate || !yearEndDate || !mediaType) {
      logger.log("Bad request. ");
      return res.status(400).send({
        message: "Bad request.",
      });
    }
    const typesResponse = await Pa.SearchNasaImage(req.body);
    res.send(typesResponse);
  } catch (err) {
    logger.log("Error: ", err);
    return res.status(500).send({
      status: 500,
      message: err.message || "Error! Internal Server Error.",
    });
  }
};

 