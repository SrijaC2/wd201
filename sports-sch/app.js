/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const { Sport } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.set("view engine", "ejs");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  const allSports = await Sport.getSports();
  if (request.accepts("html")) {
    response.render("index", {
      allSports,
    });
  } else {
    response.json({
      allSports,
    });
  }
});

app.post("/sport", async (request, response) => {
  console.log("Creating a sport", request.body);
  try {
    const sport = await Sport.addSport({
      title: request.body.title,
    });
    return response.json(sport);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
