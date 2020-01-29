$(document).ready(function () {
  console.log("Composer-char-counter: document has loaded");
  let count = 0;

    //On event keyup:
  $("section form textarea").keyup(function () {
    //Creates and updates the counter number
    count = 140 - $(this).val().length;
    //Parses through the sibling elements until the class counter is found
    let sibling = $(this).nextAll(".counter")
    //Sets the text value of the counter class to the count var
    $(sibling).text(count.toString())
    //Handles changing the color of the counter
    if (count < 0) {
      $(sibling).css("color", "red")
    } else {
      $(sibling.css("color", "gray"))
    }
  });
});

// $("section .counter").click(function () {
//   console.log("Handler for .click() called.");
// });