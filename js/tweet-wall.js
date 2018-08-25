$( document ).ready(function() {
    var url = new URL(window.location.href);
    var interval = url.searchParams.get("interval"); // Time interval between fetching new Tweets.
    console.log(interval);

    var since_id = "0";

    function displayTweet(tweet) {
        console.log(tweet);
    }

    function rotateTweets(tweets) {
        console.log(interval / tweets.length);
        increment = interval / tweets.length;
        $.each(tweets, function( k, v ) {
            setTimeout(function() { displayTweet( v ); }, (k+1) * increment );
        });

    }

    $.getJSON( "../json/tweets.php", function( data ) {
      // var items = [];
      // $.each( data, function( key, val ) {
      //   items.push( "<li id='" + key + "'>" + val + "</li>" );
      // });
      //
      // $( "<ul/>", {
      //   "class": "my-new-list",
      //   html: items.join( "" )
      // }).appendTo( "body" );
      tweet = data[0].text;
      $("p").text(tweet);
      console.log(tweet);
      rotateTweets(data);
    });
});
