let mongoose = require("mongoose");

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/news_app_db";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

let hbs = require("express-handlebars");
let express = require("express");
let app = express();

app.engine(".hbs", hbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./controllers/controller.js")(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
  console.log("http://127.0.0.1:" + PORT);
});
