var log4js = require("../config/logger");
var logger = log4js.getLogger();
const { verifyJWTToken } = require("../utility/jwt.token.auth");

module.exports = (app) => {
  const pa = require("../controllers/pa.controller");
  var router = require("express").Router();
  console.log("routes called....");
  router.post("/test", pa.test); 
  router.post("/SearchNasaImage", pa.SearchNasaImage);

  //Router path
  app.use("/api/", router);
};
