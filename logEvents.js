// Npm Modules
const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

// Core Node Modules
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const logEvents = async (message) => {
  const dateTime = `${format(new Date(), "MM-dd-yyyy \t hh:mm:ss")}`;
  const logItem = `${dateTime} \t ${uuidv4()} \t ${message} \n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "logs", "eventLogs.txt"),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;