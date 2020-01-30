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
  $button.on('submit', function () {
    console.log("Tweet Submitted, performing ajax call...")
    const sent = $('#send-tweet').serialize();
    const temp = sent.slice(5)
    event.preventDefault();
    if (temp.length > 140) {
      alert("Too many characters")
    } else if (temp.length === 0) {
      alert("Empty input field")
    } else {
      $.ajax(({ url: '/tweets/', method: 'POST', data: $('#send-tweet').serialize() }))
        .then(function () {
          loadTweets();
        })
    }
  })

  const createTweetElement = function (input) {

    const escape = function (str) {
      let div = document.createElement('div')
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }
    const avatar = `<img src= ${escape(input.user.avatars)}>`
    const name = `<div> ${escape(input.user.name)} </div>`
    const handle = `<p> ${escape(input.user.handle)} </p>`
    const text = `<p id="content">${escape(input.content.text)}</p>`
    const timeCreated = `<p> ${escape(input.created_at)}</p>`
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

