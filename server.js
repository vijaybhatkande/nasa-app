require('dotenv').config({ path: '.env.'+(process.env.NODE_ENV) })
const express = require("express");
const cors = require("cors");
const app = express();
var log4js = require('./app/config/logger.js');
var logger = log4js.getLogger();
const fileUpload = require("express-fileupload");

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
})); /* bodyParser.urlencoded() is deprecated */

// app.use('/uploads', express.static('uploads'))
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//enable the express-fileupload middleware
app.use(
  fileUpload()
);
// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Healthy Server"
  });
});

require("./app/routes/pa.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
  console.log(`Server is running on port ${PORT}.`);
  console.log(`http://localhost:8080/api/logIn`);
});