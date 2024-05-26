const log4js = require("log4js");

var log_dir=process.env.LOG_DIR || "logs";
var log_level=process.env.LOG_LEVEL || "INFO"
var log_rotation=process.env.LOG_NUM || 5
var log_max_size=process.env.LOG_MAX_SIZE || 10485760

log4js.configure({
  appenders: {
    fileAppender: {
      type: 'dateFile',
      filename: 'logs/log',
      pattern: 'yyyy-MM-dd.log', // Date pattern for filename
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['fileAppender'],
      level: 'debug'
    }
  }
});

module.exports=log4js