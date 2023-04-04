// Core Node Modules
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;
const http = require("http");
const logEvents = require("./logEvents");

//servefile 
const serveFile = async (filePath, contentType, response) => {
    try {
      let data;
      if (contentType === "application/json") {
        data = await fsPromises.readFile(filePath, "utf-8");
        data = JSON.parse(data);
      } else if (contentType.startsWith("image/")) {
        if (!fs.existsSync(filePath)) {
          response.statusCode = 404;
          response.end();
          return;
        }
        data = await fsPromises.readFile(filePath);
      } else {
        data = await fsPromises.readFile(filePath, "utf-8");
      }
      response.writeHead(200, { "Content-Type": contentType });
      response.end(contentType === "application/json" ? JSON.stringify(data) : data);
    } catch (err) {
      console.log(err);
      response.statusCode = 500;
      response.end();
    }
  };
  
  const server = http.createServer((req, res) => {
    logEvents(`${req.method} request made to ${req.url}`);
    console.log(req.url);
  
    let contentType;
    const extension = path.extname(req.url);
    switch (extension) {
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "text/javascript";
        break;
      case ".txt":
        contentType = "text/plain";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".jpg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      default:
        contentType = "text/html";
    }
  
    let filePath = path.join(__dirname, "views", req.url);
    if (contentType === "text/html" && req.url === "/") {
        filePath = path.join(__dirname, "views", "index.html");
      } else if (contentType === "text/html" && req.url.slice(-1) === "/") {
        filePath = path.join(__dirname, "views", "index.html");
      } else if (contentType === "text/html") {
        filePath = path.join(__dirname, "views", req.url);
      } else if (contentType === "application/json" || contentType === "text/plain") {
        filePath = path.join(__dirname, "data", req.url);
    } else if (contentType.startsWith("image/")) {
    filePath = path.join(__dirname, "views", "images", path.basename(req.url));
    }

      const fileExits = fs.existsSync(filePath);

  if (fileExits) {
    serveFile(filePath, contentType, res);
  } else {
    // 404
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case " www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }

  
    serveFile(filePath, contentType, res);
  });
  
  server.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
  