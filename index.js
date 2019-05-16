let mongoose = require("mongoose");

var MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://heroku_1h78lnnd:oc1uomns5u9n96k0g5m3kt4474@ds157516.mlab.com:57516/heroku_1h78lnnd";

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
  console.log(`http://127.0.0.1:${PORT}`);
});
