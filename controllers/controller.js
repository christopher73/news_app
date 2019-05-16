// import models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index", false);
  });
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      //let arr_result = [];
      $(".css-8atqhb").each(function(i, element) {
        let result = {};
        let body_txt = [];
        result.title = $(this)
          .find("h2")
          .text();
        body_txt.push(
          $(this)
            .find(".e1n8kpyg0")
            .text()
        );
        body_txt.push(
          $(this)
            .find(".e1n8kpyg1")
            .text()
        );

        result.body = body_txt.join("");
        result.is_saved = false;
        //arr_result.push(result);
        console.log(result);
        // Create a new Article using the `result` object built from scraping
        db.News.create(result)
          .then(function(dbNews) {
            // View the added result in the console
            console.log(dbNews);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
      // console.log(arr_result);
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    db.News.find({}, { __v: 0 }, (err, articles) => res.send({ articles }));
  });
  app.get("/comments", function(req, res) {
    db.News.find({ _id: req.body.id }, { __v: 0 }, (err, articles) =>
      res.send({ articles })
    );
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/saved", function(req, res) {
    db.News.find({ is_saved: true }, { __v: 0 }, (err, articles) =>
      res.send({ articles })
    );
  });

  // Route for saving/updating an Article's associated Note
  app.post("/saveit", function(req, res) {
    console.log(req.body.id);
    db.News.findByIdAndUpdate(
      { _id: req.body.id },
      { is_saved: true },
      function(result) {
        console.log(result);
        res.send("recieved");
      }
    );
  });

  app.post("/clearit", function(req, res) {
    db.News.remove({}, function(result) {
      console.log(result);
      res.send("db erased");
    });
  });

  app.post("/clear", function(req, res) {
    console.log(req.body.id);
    db.News.findByIdAndRemove({ _id: req.body.id }, function(result) {
      console.log(result);
      res.send("recieved and erased");
    });
  });

  app.post("/addComment", function(req, res) {
    console.log(req.body.id);
    db.News.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $push: { comments: { comment: req.body.comment } }
      },
      function(result) {
        console.log(result);
        db.News.find({ _id: req.body.id }, { __v: 0 }, (err, articles) =>
          res.send({ articles })
        );
      }
    );
  });
};
