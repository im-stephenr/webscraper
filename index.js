const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();

// set view engine
app.set("view engine", "ejs");

const PORT = 3000;
const URL = "https://pinoymovieshub.net/";
let scraped_data = [];

app.get("/", function (req, res) {
  axios
    .get(URL)
    .then((response) => {
      const html = response.data; // store the response to const html
      const $ = cheerio.load(html); // load the html to cheerio
      $("article").each(function () {
        const title = $(this).find("h3 a").text();
        const year = $(this).find("span").text();
        const link = $(this).find("h3 a").attr("href");
        const img_src = $(this).find("img").attr("src");
        scraped_data.push({
          title,
          year,
          link,
          img_src,
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });

  res.render("../views/pages/index", { scraped_data });
});

app.listen(PORT, () => {
  console.log("Connected to port: ", PORT);
});
