$( document ).ready(function() {
    var url = new URL(window.location.href);
    var interval = ""; // Time interval between fetching new Tweets.
    var since_id = "1033098018441052161";

    if (url.searchParams.get("interval")) {
        interval = url.searchParams.get("interval");
    } else {
        interval = 60000;
    }

    function displayTweet(tweet, i, tweetCount) {
        console.log(tweet);
        var tweetText;
        if (tweet.retweeted_status) {
            tweetText = tweet.retweeted_status.full_text;
        } else {
            tweetText = tweet.full_text;
        }
        var url;
        var tweetUrlRemoved;
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        url = tweetText.match(regex);
        if (url) {
            tweetUrlRemoved = tweetText.replace(url[0],'');
            tweetUrlRemoved = tweetUrlRemoved+' <a href="'+url[0]+'">'+url[0]+'</a>';
        } else {
            tweetUrlRemoved = tweetText;
        }
        console.log(tweetUrlRemoved);
        $( "p" ).fadeOut( "fast", function() {
            $(".user").html('<a href="https://twitter.com/'+tweet.user.screen_name+'">@'+tweet.user.screen_name+'</a>');
            $(".tweet").html(tweetUrlRemoved);
            $("p").fadeIn( "fast", function() {
                console.log(i+1+" "+tweetCount);
                if ( (i+1) == tweetCount ) {
                    //fetchTweets();
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
        $.getJSON( "/json/tweets.php?since_id="+since_id, function( tweets ) {
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
