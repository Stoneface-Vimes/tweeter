
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  

  //Sets a variable atteched to the form that handles inputting and submitting
  //tweets
  const $button = $(" .new-tweet form ");

  //slides the compose area in on click
  $('.write img').on('click', function () {
    $('.new-tweet').slideToggle(function () {
      //After the form slides out, focuses on the textarea, allowing typing
      $('.new-tweet form textarea').trigger("focus")
    })
  })


  //Gets the tweets from the database and passes them to the renderTweets function
  const loadTweets = function () {
    $.ajax('/tweets/', { method: "GET" })
      .then(function (data) {
        renderTweets(data);

      })
  }
  //On window load, hides the new-tweet element and, if there are no tweets present, loads them.
  $(window).on('load', function () {
    $('.new-tweet').hide()
    if ($('article').has("div").length === 0) {
      loadTweets();
    }
  })


  //stetch: re-write below to loop through the tweets, add them to an html
  //element and replace the .tweet-container with it, as opposed to looking up
  //and appending to the tweet-container every time you loop through tweetArray
  const renderTweets = function (tweetArray) {
    //Clears the tweet-container HTML
    $('.tweet-container').html('')
    //Loops through each element of the tweetArray, runs them through the formatting function
    //And then appends said element to the appropriate HTML area
    for (const element of tweetArray) {
      let $toBeAppended = createTweetElement(element);
      $('.tweet-container').prepend($toBeAppended);
    }
  }

  // Watches for a submit event, specifically the one sent by the 'TWEET' button
  $button.on('submit', function (evt) {
    //Prevents the default submit event from firing
    evt.preventDefault();
    //Serializes the tweet, then slices out any non-tweet data
    const sent = $('#send-tweet').serialize();
    const temp = sent.slice(5)
    //Error logic
    if (temp.length > 140) {
      //Clears any errors already present by empyting the relevant HTML
      $('.new-tweet #error-display').html('')
      //Sets the corresponding HTML to be hidden
      $('.new-tweet #error-display').hide();
      //Adds an appropraite error message to the now-hidden HTML 
      $('.new-tweet #error-display').append("<p> You've typed too many characters </p>")
      //Slides out the newly created error message
      $('.new-tweet #error-display').slideToggle();
    } else if (temp.length === 0) {
      //Same as above
      $('.new-tweet #error-display').html('')
      $('.new-tweet #error-display').hide();
      $('.new-tweet #error-display').append("<p> Please write something to share </p>")
      $('.new-tweet #error-display').slideToggle();
      //If no errors
    } else {
      //Slides any present error messages up, then clears their HTML
      $('.new-tweet #error-display').slideToggle(function () {
        $('.new-tweet #error-display').html('')
      })
      //Performs an AJAX POST request, allowing the newly created tweet to be appended
      //to the tweets already present without refreshing the page 
      $.ajax(({ url: '/tweets/', method: 'POST', data: $(evt.target).serialize() }))
        .then(function () {
          //After the tweet has been sent, calls the loadTweets function
          loadTweets();
        })
      //Clears textbox only after a valid tweet submission
      $("#send-tweet").trigger("reset")
      //Resets the counter to 140
      const defaultCounter = 140;
      $('.counter').text(defaultCounter.toString())
    }
  })

  //Takes in an object with a consistent format. The object contains
  //all the user definable data related to displaying there tweets
  const createTweetElement = function (input) {

    //Replaces user-inputted HTML with the corresponding escape chars
    const escape = function (str) {
      let div = document.createElement('div')
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }
    //Cleans each of the users inputs so no unwanted HTML is run
    const time = moment(input.created_at).fromNow()
    const avatar = `<img src= ${escape(input.user.avatars)}>`
    const name = `<div> ${escape(input.user.name)} </div>`
    const handle = `<p> ${escape(input.user.handle)} </p>`
    const text = `<p id="content">${escape(input.content.text)}</p>`
    const timeCreated = `<p> ${escape(time)}</p>`

    //Creates HTML markup data, with the appropriate, cleaned user data
    const markup = `
    <header>
        ${avatar}
        ${name}
        ${handle}
    </header>
    ${text}
    <footer>
      ${timeCreated}
      <div>
        <img src="/images/flag.png">
        <img src="/images/retweet.png">
        <img src="/images/twitter-heart.png">
      </div>
    </footer>
`;
    return markup;
  }



});

