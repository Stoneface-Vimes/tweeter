
//This nested function is responsible for handling the character count, both the count itself and
//changing the font color
$(document).ready(function () {
  //Stores the length of the users string as they type it
  let count = 0;

  //On input:
  $("main section form textarea").on('input', function () {
    //Updates the counter number
    count = 140 - $(this).val().length;
    //Climbs up one parent, then browses the child elements until the class 'counter' is found
    let cousin = $(this).parent("form").find(".counter")
    //Sets the text value of the counter class to the count var
    $(cousin).text(count.toString())
    //Handles changing the color of the counter
    if (count < 0) {
      $(cousin).css("color", "red")
    } else {
      $(cousin.css("color", "gray"))
    }
  });
});
