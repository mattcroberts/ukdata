var winston = require("winston");

var log = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: "warn",
        json:false,
        colorize: true,
        prettyPrint:true,
        handleExceptions:true
      }),
      new (winston.transports.File)({ 
        filename: "ukdata.log",
        level:"silly",
        json:false,
        maxsize: 1 * 1024 * 1024, //1mb
        prettyPrint:true,
        handleExceptions:true })
    ]
});


module.exports = log;