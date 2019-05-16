$(document).ready(function() {
  // Grab the articles as a json

  $("#add").on("click", function(e) {
    e.preventDefault();
    $("#jumbo").empty();

    $.ajax({
      method: "GET",
      url: "http://127.0.0.1:8080/scrape"
    })
      .then(result => {
        $.getJSON("/articles", function(data) {
          console.log(data.articles[2]);
          // For each one
          for (var i = 0; i < data.articles.length; i++) {
            // Display the apropos information on the page
            $("#articles").append(
              `<div class="card mb-4 shadow-sm"><h2 class="h2 col-md-12">${
                data.articles[i].title
              }</h2>
        <div class="card-body">
        <p class="card-text">${data.articles[i].body}</p>
        <button id="save" data-id="${data.articles[i]._id}"
        class="btn btn-outline-success my-2 float-right" type="submit">Save This Articles</button></div></div>`
            );
          }
        });
        console.log(result.data);
      })
      .catch(err => {
        console.log(err);
      });
  });

  $("#clear").on("click", function() {
    $.ajax({
      method: "POST",
      url: "http://127.0.0.1:8080/clearit"
    }).then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
    });
  });

  $("#save_nav").on("click", function(e) {
    e.preventDefault();
    $("#articles").empty();
    $.getJSON("/saved", function(data) {
      console.log(data.articles[2]);
      // For each one
      for (var i = 0; i < data.articles.length; i++) {
        // Display the apropos information on the page
        $("#articles").append(
          ` 
          <div class="mb-4 shadow-sm "><h2 class="h2">${
            data.articles[i].title
          }</h2>
          <div class="row m-auto">
          
          <div class="col-md-6 my-2 ">
         
          <p class="card-text">${data.articles[i].body}</p>
        
          </div> 
          <div class="col-md-6 my-2 ">
          <div id="comment-here-${data.articles[i]._id}"></div>
          <input id="comment-txt-${
            data.articles[i]._id
          }" type="text" class="form-control card-text"  placeholder="add comments here"> 
          <button id="comment-btn" data-btn-id="${data.articles[i]._id}"
          class="comment-btn btn btn-success my-2 float-right " type="submit">Add Comment</button>
          <button id="not-save" data-id="${
            data.articles[i]._id
          }" class="btn btn-outline-danger m-2 float-right" type="submit">Erase Article</button>
        
          
          </div></div></div>
         `
        );
      }
    });
  });

  $(document).on("click", "#save", function() {
    console.log($(this).attr("data-id"));
    $.ajax({
      method: "POST",
      url: "http://127.0.0.1:8080/saveit",
      data: {
        // Value taken from title input
        id: $(this).attr("data-id")
      }
    }).then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
    });
  });

  $(document).on("click", ".comment-btn", function() {
    console.log($(`#comment-txt-${$(this).attr("data-btn-id")}`).val());
    $.ajax({
      method: "POST",
      url: "http://127.0.0.1:8080/addcomment",
      data: {
        // Value taken from title input
        id: $(this).attr("data-btn-id"),
        comment: $(`#comment-txt-${$(this).attr("data-btn-id")}`).val()
      }
    }).then(function(data) {
      for (var i = 0; i < data.articles[0].comments.length; i++) {
        $(`#comment-here-${data.articles[0]._id}`).append(
          `<h4>"${data.articles[0].comments[i].comment}"</h4>`
        );
      }
      console.log(data);

      // Empty the notes section
    });
  });

  $(document).on("click", "#not-save", function() {
    console.log($(this).attr("data-id"));
    $.ajax({
      method: "POST",
      url: "http://127.0.0.1:8080/clear",
      data: {
        // Value taken from title input
        id: $(this).attr("data-id")
      }
    }).then(function(data) {
      // Log the response
      $("#save_nav").trigger("click");
      console.log(data);
      // Empty the notes section
    });
  });
});

//   $("#add").on("click", function() {
//     console.log("hi");
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");

//     // Now make an ajax call for the Article
//     $.ajax({
//       method: "GET",
//       url: "/articles"
//     })
//       // With that done, add the note information to the page
//       .then(function(data) {
//         console.log(data);
//         // The title of the article
//         $("#notes").append("<h2>" + data.title + "</h2>");
//         // An input to enter a new title
//         $("#notes").append("<input id='titleinput' name='title' >");
//         // A textarea to add a new note body
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//         // A button to submit a new note, with the id of the article saved to it
//         $("#notes").append(
//           "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
//         );

//         // If there's a note in the article
//         if (data.note) {
//           // Place the title of the note in the title input
//           $("#titleinput").val(data.note.title);
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }
//       });
//   });

// Whenever someone clicks a p tag

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
