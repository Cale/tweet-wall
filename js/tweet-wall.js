$( document ).ready(function() {
    var url = new URL(window.location.href);
    var interval = url.searchParams.get("interval"); // Time interval between fetching new Tweets.
    var since_id = "1033098018441052161";

    function displayTweet(tweet, i, tweetCount) {
        console.log(tweet);
        $( "p" ).fadeOut( "fast", function() {
            $(".user").text(tweet.user.screen_name);
            $(".tweet").text(tweet.text);
            $("p").fadeIn( "fast", function() {
                console.log(i+1+" "+tweetCount);
                if ( (i+1) == tweetCount ) {
                    fetchTweets();
                    console.log("Fetch more Tweets.");
                }
            });
        });
    }

    function rotateTweets(tweets) {
        console.log(interval / tweets.length);
        tweetCount = tweets.length;
        tweetInterval = interval / tweetCount;
        $.each(tweets, function( i, tweet ) {
            setTimeout(function() { displayTweet( tweet, i, tweetCount ); }, (i+1) * tweetInterval );
        });
    }

    function fetchTweets() {
        $.getJSON( "../json/tweets.php?since_id="+since_id, function( tweets ) {
            console.log("Fetched "+tweets.length+" Tweets.")
            if ( tweets.length > 0) {
                since_id = tweets[0].id_str;
                console.log("id: "+since_id);
                rotateTweets(tweets.reverse());
            } else {
                console.log("No Tweets. Waiting...");
                setTimeout(function() { fetchTweets(); }, interval );
            }
        });
    }

    fetchTweets();
});
