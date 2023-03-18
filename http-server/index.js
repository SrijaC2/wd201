
const http = require("http");
const fs = require("fs");
const args = require("minimist")(process.argv.slice(1));

let homeContent = "";
let projectContent = "";
let registrationContent="";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});
fs.readFile("./registration.html", (err, registration) => {
    if (err) {
      throw err;
    }
    registrationContent = registration;
  });
  fs.readFile("./index1.js", (err, jsfile) => {
    if (err) {
      throw err;
    }
    JSfile = jsfile;
  });

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});

http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectContent);
        response.end();
        break;
      case "/registration":
        response.write(registrationContent);
        response.end();
        break;
      case "/index1.js":
        response.write(JSfile);
        response.end();
        break;
      default:
        response.write(homeContent);
        response.end();
        break;
    }
  })
  .listen(args);