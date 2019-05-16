// Exporting an object containing all of our models

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var commentSchema = new Schema(
  {
    comment: String
  },
  {
    timestamps: true
  }
);

var NewsSchema = new Schema(
  {
    title: String,
    body: String,
    comments: String,
    is_saved: false,
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("News", NewsSchema);

// Export the Note model
module.exports = News;
