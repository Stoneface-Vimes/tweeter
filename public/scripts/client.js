
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {



  const $button = $(" .new-tweet form ");
  //slides the compose area in click
  $('.write img').on('click', function () {
      $('.new-tweet').slideToggle(function() {
        //After the form slides out, focuses on the textarea allowing typing
        $('.new-tweet form textarea').trigger("focus")

      })
  })



  const loadTweets = function () {
    $.ajax('/tweets/', { method: "GET" })
      .then(function (data) {
        renderTweets(data);

      })
  }
  $(window).on('load', function () {
    console.log("initial tweet load")
    if ($('article').has("div").length === 0) {
      loadTweets();
    }
  })


  //stetch: re-write below to loop through the tweets, add them to an html
  //element and replace the .tweet-container with it, as opposed to looking up
  //and appending to the tweet-container every time you loop through tweetArray
  const renderTweets = function (tweetArray) {
    $('.tweet-container').html('')
    for (const element of tweetArray) {
      let $toBeAppended = createTweetElement(element);
      $('.tweet-container').prepend($toBeAppended);
    }
  }

  // Watches for a sunbmit event
  $button.on('submit', function (evt) {
    //Clears any error messages that may be present related to submitting tweets
    console.log("Tweet Submitted, performing ajax call...")
    const sent = $('#send-tweet').serialize();
    const temp = sent.slice(5)
    evt.preventDefault();
    //Error logic
    if (temp.length > 140) {
      $('.new-tweet #error-display').html('')
      $('.new-tweet #error-display').hide();
      $('.new-tweet #error-display').append("<p> You've typed too many characters </p>")
      $('.new-tweet #error-display').slideToggle();
    } else if (temp.length === 0) {
      $('.new-tweet #error-display').html('')
      $('.new-tweet #error-display').hide();
      $('.new-tweet #error-display').append("<p> Please write something to share </p>")
      $('.new-tweet #error-display').slideToggle();
    //If no errors
    } else {
      $('.new-tweet #error-display').slideToggle(function () {
        $('.new-tweet #error-display').html('')
      })
      //Clears errors
      $.ajax(({ url: '/tweets/', method: 'POST', data: $(evt.target).serialize() }))
        .then(function () {
          loadTweets();
        })
        //Clears textbox
        $("#send-tweet").trigger("reset")
    }
  })

  const createTweetElement = function (input) {

    const escape = function (str) {
      let div = document.createElement('div')
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }
    const time = moment(input.created_at).fromNow()
    console.log(time)
    const avatar = `<img src= ${escape(input.user.avatars)}>`
    const name = `<div> ${escape(input.user.name)} </div>`
    const handle = `<p> ${escape(input.user.handle)} </p>`
    const text = `<p id="content">${escape(input.content.text)}</p>`
    const timeCreated = `<p> ${escape(time)}</p>`
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

